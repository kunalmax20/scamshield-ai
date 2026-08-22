/**
 * ScamShield AI — Risk Engine Service
 * Hybrid Scoring Aggregator & Risk Level Classifier
 */

export class RiskEngine {
  static evaluate(ruleResult = {}, aiResult = {}) {
    const ruleScore = Number(ruleResult.ruleScore) || 0;
    const aiScore = Number(aiResult.riskScore) || 0;

    // Weighted composite calculation: 50% Rule Engine + 50% AI Engine
    const finalScore = Math.min(100, Math.round((ruleScore * 0.50) + (aiScore * 0.50)));

    // Risk Level Threshold Mapping
    let riskLevel = 'LOW';
    if (finalScore >= 76) {
      riskLevel = 'CRITICAL';
    } else if (finalScore >= 51) {
      riskLevel = 'HIGH';
    } else if (finalScore >= 26) {
      riskLevel = 'MEDIUM';
    }

    const isScam = finalScore >= 35 || aiResult.isScam || false;

    // Combine signals cleanly without duplicates
    const combinedSignals = Array.from(
      new Set([...(ruleResult.signals || []), ...(aiResult.signals || [])])
    );

    return {
      isScam,
      riskScore: finalScore,
      riskLevel,
      category: aiResult.category || ruleResult.suggestedCategory || 'OTHER',
      signals: combinedSignals,
      explanation: aiResult.explanation || 'Hybrid detection completed analysis.',
      recommendation: aiResult.recommendation || 'Verify through official channels.',
      ruleScore,
      aiScore,
      urls: ruleResult.extractedUrls || []
    };
  }
}
