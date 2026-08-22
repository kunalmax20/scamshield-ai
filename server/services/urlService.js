/**
 * ScamShield AI — URL Scanner Service
 * Domain Parsing, Pattern Evaluation, Brand Impersonation & Phishing Risk Analysis
 */

const KNOWN_SHORTENERS = [
  'bit.ly', 'tinyurl.com', 't.co', 'goo.gl', 'is.gd', 'buff.ly', 'cutt.ly', 'ow.ly', 'rb.gy'
];

const HIGH_RISK_TLDS = [
  '.xyz', '.top', '.site', '.online', '.tech', '.vip', '.cc', '.zip', '.mov', '.fit', '.rest', '.club', '.work'
];

const TARGET_BRANDS = [
  'sbi', 'hdfc', 'icici', 'axis', 'pnb', 'paytm', 'phonepe', 'gpay', 'amazon', 'flipkart', 'netflix', 'paypal', 'apple'
];

const SENSITIVE_KEYWORDS = [
  'kyc', 'verify', 'update', 'login', 'secure', 'account', 'blocked', 'suspended', 'claim', 'reward', 'refund', 'banking'
];

export class URLService {
  static analyze(inputUrl) {
    if (!inputUrl || typeof inputUrl !== 'string') {
      return {
        urlScore: 0,
        signals: [],
        details: { domain: '', protocol: '', isIp: false }
      };
    }

    // Ensure protocol for parsing
    let parsedUrl;
    let formattedUrl = inputUrl.trim();
    if (!/^https?:\/\//i.test(formattedUrl)) {
      formattedUrl = 'http://' + formattedUrl;
    }

    try {
      parsedUrl = new URL(formattedUrl);
    } catch (err) {
      return {
        urlScore: 50,
        signals: ['Invalid or malformed URL structure'],
        details: { domain: inputUrl, protocol: 'unknown', isIp: false }
      };
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const protocol = parsedUrl.protocol.replace(':', '');
    const pathname = parsedUrl.pathname.toLowerCase();
    const fullUrlString = parsedUrl.href.toLowerCase();

    const signals = [];
    let score = 0;

    // 1. IP-Based Hostname Check
    const isIp = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
    if (isIp) {
      score += 40;
      signals.push('Numeric IP-address used as hostname instead of a domain name');
    }

    // 2. Missing HTTPS Security Check
    if (protocol === 'http') {
      score += 15;
      signals.push('Insecure connection (HTTP instead of encrypted HTTPS)');
    }

    // 3. Shortened URL Detection
    const isShortened = KNOWN_SHORTENERS.some((s) => hostname === s || hostname.endsWith('.' + s));
    if (isShortened) {
      score += 25;
      signals.push('URL shortening service obfuscating original destination');
    }

    // 4. High-Risk Phishing TLD Check
    const hasHighRiskTld = HIGH_RISK_TLDS.some((tld) => hostname.endsWith(tld));
    if (hasHighRiskTld) {
      score += 20;
      signals.push(`Suspicious top-level domain frequently associated with phishing (${hostname.slice(hostname.lastIndexOf('.'))})`);
    }

    // 5. Brand Impersonation & Spoofing Check
    let matchedBrand = null;
    let matchedKeyword = null;

    TARGET_BRANDS.forEach((brand) => {
      if (hostname.includes(brand)) {
        matchedBrand = brand;
      }
    });

    SENSITIVE_KEYWORDS.forEach((kw) => {
      if (hostname.includes(kw) || pathname.includes(kw)) {
        matchedKeyword = kw;
      }
    });

    // Check if brand is combined with hyphen or subdomains (e.g., sbi-kyc-update.com)
    if (matchedBrand) {
      // Check if domain is official (e.g. sbi.co.in or onlinesbi.sbi or hdfcbank.com)
      const officialDomains = ['onlinesbi.sbi', 'sbi.co.in', 'hdfcbank.com', 'icicibank.com', 'axisbank.com', 'paytm.com', 'phonepe.com'];
      const isOfficial = officialDomains.some((off) => hostname === off || hostname.endsWith('.' + off));

      if (!isOfficial) {
        score += 35;
        signals.push(`Brand impersonation detected: claims to be '${matchedBrand.toUpperCase()}' on non-official domain (${hostname})`);
      }
    }

    if (matchedKeyword && !matchedBrand) {
      score += 15;
      signals.push(`Sensitive security keyword ('${matchedKeyword}') in URL path`);
    }

    // 6. Subdomain Depth & Excessive Length
    const subdomainParts = hostname.split('.');
    if (subdomainParts.length > 3) {
      score += 15;
      signals.push('Excessive subdomain depth often used to mask malicious host');
    }

    if (fullUrlString.length > 75) {
      score += 10;
      signals.push('Abnormally long URL length with potential tracking or payload parameters');
    }

    const urlScore = Math.min(100, score);

    return {
      urlScore,
      signals,
      details: {
        url: formattedUrl,
        domain: hostname,
        protocol,
        isIp,
        isShortened,
        matchedBrand
      }
    };
  }
}
