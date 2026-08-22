/**
 * ScamShield AI — Rule Engine Service
 * Comprehensive India-Focused Fraud & Multi-Language (English, Hindi, Hinglish) Pattern Matcher
 */

const PATTERNS = {
  urgency: [
    /immediately/i,
    /blocked today/i,
    /account (will be|has been) (blocked|suspended|deactivated)/i,
    /within 24 hours/i,
    /urgent action required/i,
    /today only/i,
    /expire(d)? (today|soon)/i,
    /disconnected (tonight|today|at \d+)/i,
    // Hinglish & Devanagari
    /band (ho jayega|hone wala hai|kar diya jayega)/i,
    /turant/i,
    /aaj hi/i,
    /aaj raat/i,
    /खाता/i,
    /ब्लॉक/i,
    /तुरंत/i,
    /बंद हो जाएगा/i
  ],
  bankingImpersonation: [
    /\b(SBI|HDFC|ICICI|Axis|PNB|BOB|Canara|Kotak|Paytm|PhonePe|GPay|BHIM|UPI)\b/i,
    /bank account/i,
    /net banking/i,
    /debit card/i,
    /credit card/i,
    /kyc (update|verification|expired|process)/i,
    /electricity (office|bill|connection|power)/i,
    // Hinglish & Devanagari
    /apka (bank|account|kyc)/i,
    /bank se/i,
    /bijli (office|bill)/i,
    /बैंक/i,
    /केवाईसी/i,
    /बिजली/i
  ],
  sensitiveRequests: [
    /share (your )?otp/i,
    /enter (your )?(pin|password|cvv)/i,
    /card number/i,
    /verification code/i,
    /scan (this )?qr (code)?/i,
    // Hinglish & Devanagari
    /otp (maange|share kare|bheje)/i,
    /pin (daale|share kare|enter kare)/i,
    /qr code scan/i,
    /ओटीपी/i,
    /पिन/i
  ],
  financialPrompts: [
    /claim (your )?(reward|refund|cashback|prize)/i,
    /transfer ₹?\d+/i,
    /pay ₹?\d+/i,
    /won ₹?\d+/i,
    /lottery/i,
    /unclaimed (amount|funds)/i,
    /income tax refund/i,
    // Hinglish & Devanagari
    /paise (milega|jeeta|transfer)/i,
    /cashback (milega|claim)/i,
    /इनाम/i,
    /रिफंड/i
  ],
  jobScams: [
    /work from home/i,
    /daily income/i,
    /earn ₹?\d+ (daily|per day)/i,
    /part time job/i,
    /no experience required/i,
    /telegram (group|channel) for job/i
  ],
  deliveryScams: [
    /courier (delayed|pending|failed)/i,
    /parcel (address|delivery|status)/i,
    /speedpost/i,
    /update delivery address/i,
    /customs duty/i,
    /post office/i
  ],
  governmentImpersonation: [
    /cyber (cell|crime|branch)/i,
    /police (department|notice|warrant)/i,
    /digital arrest/i,
    /court summons/i,
    /legal action/i,
    /cbi/i,
    /ed notice/i
  ],
  urls: /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9-]+\.(com|in|org|net|xyz|top|online|site|tech|vip|cc|co|info|biz|link)\/[^\s]*)/gi
};

export class RuleEngine {
  static analyze(text) {
    if (!text || typeof text !== 'string') {
      return {
        ruleScore: 0,
        signals: [],
        extractedUrls: [],
        suggestedCategory: 'OTHER'
      };
    }

    const signals = [];
    let score = 0;
    const extractedUrls = [];

    // 1. URL Extraction
    const urlMatches = text.match(PATTERNS.urls);
    if (urlMatches && urlMatches.length > 0) {
      urlMatches.forEach((url) => extractedUrls.push(url));
      score += 25;
      signals.push('Suspicious URL detected in message');
    }

    // 2. Urgency Check
    const hasUrgency = PATTERNS.urgency.some((p) => p.test(text));
    if (hasUrgency) {
      score += 20;
      signals.push('Urgency or immediate threat language detected (English/Hindi/Hinglish)');
    }

    // 3. Bank/Utility Impersonation Check
    const hasBanking = PATTERNS.bankingImpersonation.some((p) => p.test(text));
    if (hasBanking) {
      score += 20;
      signals.push('Financial institution, UPI service, or utility provider impersonation detected');
    }

    // 4. Sensitive Information Request / QR Code Trap
    const hasSensitiveReq = PATTERNS.sensitiveRequests.some((p) => p.test(text));
    if (hasSensitiveReq) {
      score += 25;
      signals.push('OTP, PIN, CVV, or suspicious QR code scanning requested');
    }

    // 5. Financial Promise / Refund / Cashback
    const hasFinancialPrompt = PATTERNS.financialPrompts.some((p) => p.test(text));
    if (hasFinancialPrompt) {
      score += 15;
      signals.push('Unrealistic financial reward, cashback, or tax refund offer');
    }

    // 6. Job Scam Check
    const hasJobScam = PATTERNS.jobScams.some((p) => p.test(text));
    if (hasJobScam) {
      score += 20;
      signals.push('Work-from-home or high-daily-income job scam indicators');
    }

    // 7. Delivery Scam Check
    const hasDeliveryScam = PATTERNS.deliveryScams.some((p) => p.test(text));
    if (hasDeliveryScam) {
      score += 20;
      signals.push('Fake courier, SpeedPost, or package delivery notification');
    }

    // 8. Government / Police / Digital Arrest Threat
    const hasGovt = PATTERNS.governmentImpersonation.some((p) => p.test(text));
    if (hasGovt) {
      score += 30;
      signals.push('Government, Police, Cyber Crime, or Digital Arrest threat impersonation');
    }

    // Category Suggestion Logic
    let suggestedCategory = 'OTHER';
    if (hasGovt) suggestedCategory = 'GOVERNMENT_IMPERSONATION';
    else if (hasBanking && (hasUrgency || hasSensitiveReq)) suggestedCategory = 'BANKING_SCAM';
    else if (hasSensitiveReq && text.toLowerCase().includes('upi')) suggestedCategory = 'UPI_SCAM';
    else if (hasSensitiveReq) suggestedCategory = 'OTP_SCAM';
    else if (hasJobScam) suggestedCategory = 'JOB_SCAM';
    else if (hasDeliveryScam) suggestedCategory = 'DELIVERY_SCAM';
    else if (hasFinancialPrompt) suggestedCategory = 'LOTTERY_SCAM';
    else if (extractedUrls.length > 0) suggestedCategory = 'PHISHING';

    const ruleScore = Math.min(100, score);

    return {
      ruleScore,
      signals,
      extractedUrls,
      suggestedCategory
    };
  }
}
