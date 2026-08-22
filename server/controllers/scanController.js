import { ApiResponse } from '../utils/apiResponse.js';
import { RuleEngine } from '../services/ruleEngine.js';
import { AIService } from '../services/aiService.js';
import { RiskEngine } from '../services/riskEngine.js';
import { OCRService } from '../services/ocrService.js';
import { URLService } from '../services/urlService.js';
import { Scan } from '../models/Scan.js';

export const scanText = async (req, res, next) => {
  try {
    const { text } = req.body;
    const userId = req.user ? req.user._id : null;

    // 1. Rule Engine Pre-scan
    const ruleResult = RuleEngine.analyze(text);

    // 2. AI Service Contextual Analysis
    const aiResult = await AIService.analyzeText(text, ruleResult);

    // 3. Risk Engine Composite Evaluation
    const finalResult = RiskEngine.evaluate(ruleResult, aiResult);

    // 4. Save Scan Record in MongoDB Atlas
    let savedScan = null;
    try {
      savedScan = await Scan.create({
        userId,
        inputType: 'TEXT',
        originalText: text,
        extractedText: null,
        urls: finalResult.urls,
        isScam: finalResult.isScam,
        riskScore: finalResult.riskScore,
        riskLevel: finalResult.riskLevel,
        category: finalResult.category,
        signals: finalResult.signals,
        explanation: finalResult.explanation,
        recommendation: finalResult.recommendation,
        ruleScore: finalResult.ruleScore,
        aiScore: finalResult.aiScore
      });
    } catch (dbErr) {
      console.warn('[ScanController] Failed to persist scan log to MongoDB:', dbErr.message);
    }

    // 5. Return Structured Response
    return ApiResponse.success(
      res,
      'Text scan completed successfully',
      {
        id: savedScan ? savedScan._id : null,
        inputType: 'TEXT',
        originalText: text,
        isScam: finalResult.isScam,
        riskScore: finalResult.riskScore,
        riskLevel: finalResult.riskLevel,
        category: finalResult.category,
        signals: finalResult.signals,
        explanation: finalResult.explanation,
        recommendation: finalResult.recommendation,
        subScores: {
          ruleScore: finalResult.ruleScore,
          aiScore: finalResult.aiScore
        },
        urls: finalResult.urls,
        createdAt: savedScan ? savedScan.createdAt : new Date().toISOString()
      },
      200
    );
  } catch (error) {
    next(error);
  }
};

export const scanImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return ApiResponse.error(res, 'Please upload a screenshot image file (PNG, JPG, or WEBP).', 400);
    }

    const userId = req.user ? req.user._id : null;

    // 1. Perform Tesseract OCR Text Extraction
    const ocrResult = await OCRService.extractText(req.file.buffer);
    const extractedText = ocrResult.cleanText;

    if (!extractedText || extractedText.length < 3) {
      return ApiResponse.error(
        res,
        'Could not extract legible text from uploaded screenshot. Please ensure the image contains clear readable text.',
        400
      );
    }

    // 2. Rule Engine Pre-scan on Extracted Text
    const ruleResult = RuleEngine.analyze(extractedText);

    // 3. AI Service Contextual Analysis
    const aiResult = await AIService.analyzeText(extractedText, ruleResult);

    // 4. Risk Engine Composite Evaluation
    const finalResult = RiskEngine.evaluate(ruleResult, aiResult);

    // 5. Save Scan Record in MongoDB Atlas
    let savedScan = null;
    try {
      savedScan = await Scan.create({
        userId,
        inputType: 'IMAGE',
        originalText: `[Screenshot: ${req.file.originalname}]`,
        extractedText,
        urls: finalResult.urls,
        isScam: finalResult.isScam,
        riskScore: finalResult.riskScore,
        riskLevel: finalResult.riskLevel,
        category: finalResult.category,
        signals: finalResult.signals,
        explanation: finalResult.explanation,
        recommendation: finalResult.recommendation,
        ruleScore: finalResult.ruleScore,
        aiScore: finalResult.aiScore
      });
    } catch (dbErr) {
      console.warn('[ScanController] Failed to persist image scan log to MongoDB:', dbErr.message);
    }

    // 6. Return Structured Response
    return ApiResponse.success(
      res,
      'Screenshot OCR scan completed successfully',
      {
        id: savedScan ? savedScan._id : null,
        inputType: 'IMAGE',
        originalText: `[Screenshot: ${req.file.originalname}]`,
        extractedText,
        ocrConfidence: ocrResult.confidence,
        isScam: finalResult.isScam,
        riskScore: finalResult.riskScore,
        riskLevel: finalResult.riskLevel,
        category: finalResult.category,
        signals: finalResult.signals,
        explanation: finalResult.explanation,
        recommendation: finalResult.recommendation,
        subScores: {
          ruleScore: finalResult.ruleScore,
          aiScore: finalResult.aiScore
        },
        urls: finalResult.urls,
        createdAt: savedScan ? savedScan.createdAt : new Date().toISOString()
      },
      200
    );
  } catch (error) {
    next(error);
  }
};

export const scanUrl = async (req, res, next) => {
  try {
    const { url } = req.body;
    const userId = req.user ? req.user._id : null;

    // 1. Perform URL Analysis
    const urlAnalysis = URLService.analyze(url);

    // 2. Rule Engine Pre-scan on URL string
    const ruleResult = RuleEngine.analyze(url);
    const combinedRuleScore = Math.max(ruleResult.ruleScore, urlAnalysis.urlScore);
    const combinedSignals = Array.from(new Set([...ruleResult.signals, ...urlAnalysis.signals]));

    const mergedRuleResult = {
      ruleScore: combinedRuleScore,
      signals: combinedSignals,
      extractedUrls: [urlAnalysis.details.url || url],
      suggestedCategory: urlAnalysis.details.matchedBrand ? 'BANKING_SCAM' : 'PHISHING'
    };

    // 3. AI Service Analysis on URL Context
    const aiResult = await AIService.analyzeText(`Suspicious URL input: ${url}`, mergedRuleResult);

    // 4. Composite Risk Evaluation
    const finalResult = RiskEngine.evaluate(mergedRuleResult, aiResult);

    // 5. Save Scan Record in MongoDB Atlas
    let savedScan = null;
    try {
      savedScan = await Scan.create({
        userId,
        inputType: 'URL',
        originalText: url,
        extractedText: null,
        urls: [url],
        isScam: finalResult.isScam,
        riskScore: finalResult.riskScore,
        riskLevel: finalResult.riskLevel,
        category: finalResult.category,
        signals: finalResult.signals,
        explanation: finalResult.explanation,
        recommendation: finalResult.recommendation,
        ruleScore: finalResult.ruleScore,
        aiScore: finalResult.aiScore,
        urlScore: urlAnalysis.urlScore
      });
    } catch (dbErr) {
      console.warn('[ScanController] Failed to persist URL scan log to MongoDB:', dbErr.message);
    }

    // 6. Return Structured Response
    return ApiResponse.success(
      res,
      'URL scan completed successfully',
      {
        id: savedScan ? savedScan._id : null,
        inputType: 'URL',
        originalText: url,
        urlDetails: urlAnalysis.details,
        isScam: finalResult.isScam,
        riskScore: finalResult.riskScore,
        riskLevel: finalResult.riskLevel,
        category: finalResult.category,
        signals: finalResult.signals,
        explanation: finalResult.explanation,
        recommendation: finalResult.recommendation,
        subScores: {
          urlScore: urlAnalysis.urlScore,
          aiScore: finalResult.aiScore
        },
        urls: [url],
        createdAt: savedScan ? savedScan.createdAt : new Date().toISOString()
      },
      200
    );
  } catch (error) {
    next(error);
  }
};

export const getScanHistory = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const query = { userId };
    if (req.query.riskLevel && req.query.riskLevel !== 'ALL') {
      query.riskLevel = req.query.riskLevel;
    }

    const totalScans = await Scan.countDocuments(query);
    const scans = await Scan.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    return ApiResponse.success(res, 'Scan history retrieved successfully', {
      scans,
      pagination: {
        totalScans,
        page,
        limit,
        totalPages: Math.ceil(totalScans / limit)
      }
    }, 200);
  } catch (error) {
    next(error);
  }
};

export const getScanById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const scan = await Scan.findById(id);

    if (!scan) {
      return ApiResponse.error(res, 'Scan record not found', 404);
    }

    return ApiResponse.success(res, 'Scan details retrieved successfully', {
      scan
    }, 200);
  } catch (error) {
    next(error);
  }
};
