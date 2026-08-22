import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env.js';

export class AIService {
  static async analyzeText(text, ruleResults = {}) {
    // If AI_API_KEY is not set or placeholder, use intelligent Rule Engine fallback
    if (!config.aiApiKey || config.aiApiKey === 'your_gemini_api_key_here') {
      return this.generateFallbackAnalysis(text, ruleResults, 'AI API key not configured.');
    }

    try {
      const genAI = new GoogleGenerativeAI(config.aiApiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.6-flash' });

      const prompt = `
You are ScamShield AI, an expert cybersecurity threat analyst specializing in digital fraud, phishing, banking scams, UPI fraud, electricity bill scams, digital arrest threats, and social engineering attacks (natively fluent in English, Hindi Devanagari, and Hinglish transliterated text).

Analyze the following message for potential scam indicators.

MESSAGE TO ANALYZE:
"${text}"

DETERMINISTIC SIGNALS ALREADY DETECTED:
- Rule Score: ${ruleResults.ruleScore || 0}
- Extracted URLs: ${JSON.stringify(ruleResults.extractedUrls || [])}
- Detected Patterns: ${JSON.stringify(ruleResults.signals || [])}

SPECIALIZED INDIA DETECTON GUIDELINES:
- Understand Hinglish expressions like "Apka bank account band hone wala hai", "Bijli connection disconnect kar diya jayega", "₹50 lakh jeeta", "KYC update na hone ki wajah se".
- Recognize UPI fraud vectors: Asking to "Enter UPI PIN to receive money", scanning QR code to receive cashback, fake GPay/PhonePe reward links.
- Recognize Electricity bill scams ("electricity power connection will be disconnected tonight at 9:30 PM").
- Recognize Police / Cybercrime / Digital Arrest threats.
- Provide official Indian helpline and portal recommendations when applicable (e.g., 1930 National Cyber Crime Helpline, cybercrime.gov.in, Sanchar Saathi / Chakshu portal, official bank apps).

INSTRUCTIONS:
Return a strictly formatted JSON object with NO markdown codeblock formatting, NO backticks, and NO conversational text.

Expected JSON Structure:
{
  "isScam": boolean,
  "riskScore": number (0 to 100),
  "category": "BANKING_SCAM" | "PHISHING" | "UPI_SCAM" | "OTP_SCAM" | "JOB_SCAM" | "LOTTERY_SCAM" | "DELIVERY_SCAM" | "INVESTMENT_SCAM" | "GOVERNMENT_IMPERSONATION" | "TECH_SUPPORT_SCAM" | "ROMANCE_SCAM" | "ACCOUNT_TAKEOVER" | "OTHER",
  "signals": [string array of 2 to 5 specific suspicious indicators],
  "explanation": "Clear 2-3 sentence cybersecurity explanation of WHY this is suspicious or safe.",
  "recommendation": "Clear actionable safety advice on WHAT the user should do next."
}
`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      // Clean markdown codeblocks if present
      const cleanJsonText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanJsonText);

      return {
        isScam: Boolean(parsedData.isScam),
        riskScore: Math.min(100, Math.max(0, Number(parsedData.riskScore) || ruleResults.ruleScore || 0)),
        category: parsedData.category || ruleResults.suggestedCategory || 'OTHER',
        signals: Array.isArray(parsedData.signals) ? parsedData.signals : ruleResults.signals || [],
        explanation: parsedData.explanation || 'Analyzed message for psychological urgency and credential requests.',
        recommendation: parsedData.recommendation || 'Do not click external links or share OTPs and financial details.'
      };
    } catch (error) {
      console.warn(`[AIService] Primary AI Generation failed (${error.message}). Attempting fallback model...`);
      try {
        const genAI = new GoogleGenerativeAI(config.aiApiKey);
        const fallbackModel = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-8b' });
        const result = await fallbackModel.generateContent(`Analyze for scam: "${text}". Return JSON with isScam, riskScore, category, signals, explanation, recommendation.`);
        const cleanJsonText = result.response.text().replace(/```json/gi, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(cleanJsonText);
        return {
          isScam: Boolean(parsedData.isScam),
          riskScore: Math.min(100, Math.max(0, Number(parsedData.riskScore) || ruleResults.ruleScore || 0)),
          category: parsedData.category || ruleResults.suggestedCategory || 'OTHER',
          signals: Array.isArray(parsedData.signals) ? parsedData.signals : ruleResults.signals || [],
          explanation: parsedData.explanation || 'Analyzed message for threat signals.',
          recommendation: parsedData.recommendation || 'Verify with official channels.'
        };
      } catch (fallbackErr) {
        console.warn(`[AIService] Fallback AI Generation failed (${fallbackErr.message}). Using rule fallback.`);
        return this.generateFallbackAnalysis(text, ruleResults, error.message);
      }
    }
  }

  static generateFallbackAnalysis(text, ruleResults = {}, reason = '') {
    const isScam = (ruleResults.ruleScore || 0) >= 30;
    let riskScore = ruleResults.ruleScore || 0;

    let explanation = 'Message evaluated using deterministic threat intelligence patterns.';
    let recommendation = 'Exercise standard caution when receiving unsolicited communications.';

    if (isScam) {
      explanation = `Suspicious patterns detected including: ${ruleResults.signals?.join(', ') || 'urgency and external links'}.`;
      recommendation = 'Do not click links, share OTPs, PINs, or scan QR codes. Report suspicious fraud to National Cyber Crime Helpline (1930) or cybercrime.gov.in.';
    } else {
      explanation = 'No aggressive scam patterns, urgency tactics, or suspicious credential harvesting detected.';
      recommendation = 'Message appears low risk. Always ensure sender authenticity before sharing personal information.';
    }

    return {
      isScam,
      riskScore,
      category: ruleResults.suggestedCategory || 'OTHER',
      signals: ruleResults.signals || [],
      explanation,
      recommendation,
      isFallback: true
    };
  }
}
