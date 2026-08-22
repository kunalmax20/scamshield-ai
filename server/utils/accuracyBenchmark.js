import { RuleEngine } from '../services/ruleEngine.js';
import { AIService } from '../services/aiService.js';
import { RiskEngine } from '../services/riskEngine.js';
import { URLService } from '../services/urlService.js';

// Benchmark Dataset (Ground Truth Labeled)
const BENCHMARK_DATASET = [
  // --- SCAMS (Expected: isScam = true) ---
  {
    id: 1,
    type: 'TEXT',
    input: 'Your SBI account will be blocked today. Complete KYC immediately using this link: https://sbi-kyc-verify.com',
    expectedScam: true,
    category: 'Banking Scam'
  },
  {
    id: 2,
    type: 'TEXT',
    input: 'Apka bank account band hone wala hai. Immediately click this link to update KYC: https://fake-bank-update.xyz',
    expectedScam: true,
    category: 'Hinglish Banking Scam'
  },
  {
    id: 3,
    type: 'TEXT',
    input: 'Congratulations! You won ₹50,000 cash reward from Paytm. Claim your prize immediately by sharing your UPI PIN.',
    expectedScam: true,
    category: 'UPI Fraud'
  },
  {
    id: 4,
    type: 'TEXT',
    input: 'Work from home and earn ₹5,000 daily! No experience needed. Contact on Telegram: @jobscam',
    expectedScam: true,
    category: 'Job Scam'
  },
  {
    id: 5,
    type: 'TEXT',
    input: 'Dear consumer your electricity power connection will be disconnected tonight at 9:30 PM. Call immediately: 98000XXXXX',
    expectedScam: true,
    category: 'Electricity Utility Scam'
  },
  {
    id: 6,
    type: 'URL',
    input: 'http://192.168.1.50/paytm/verify',
    expectedScam: true,
    category: 'Phishing IP URL'
  },

  // --- SAFE MESSAGES (Expected: isScam = false) ---
  {
    id: 7,
    type: 'TEXT',
    input: 'Hi Ramesh, let us meet today at 5 PM for tea near the office.',
    expectedScam: false,
    category: 'Casual Greeting'
  },
  {
    id: 8,
    type: 'TEXT',
    input: 'Your Amazon order #402-1928371 has been dispatched and will arrive tomorrow by BlueDart.',
    expectedScam: false,
    category: 'Order Notification'
  },
  {
    id: 9,
    type: 'TEXT',
    input: 'The team meeting is rescheduled to 10:30 AM in Conference Room B.',
    expectedScam: false,
    category: 'Office Communication'
  },
  {
    id: 10,
    type: 'URL',
    input: 'https://www.google.com',
    expectedScam: false,
    category: 'Legitimate Website'
  }
];

async function runBenchmark() {
  console.log('================================================================');
  console.log('      SCAMSHIELD AI — SYSTEM ACCURACY & DETECTION BENCHMARK      ');
  console.log('================================================================\n');

  let TP = 0; // True Positives (Actual scam -> Flagged scam)
  let FP = 0; // False Positives (Safe message -> Flagged scam)
  let TN = 0; // True Negatives (Safe message -> Flagged safe)
  let FN = 0; // False Negatives (Actual scam -> Flagged safe)

  const results = [];

  for (const sample of BENCHMARK_DATASET) {
    let finalResult;

    if (sample.type === 'URL') {
      const urlAnalysis = URLService.analyze(sample.input);
      const ruleResult = RuleEngine.analyze(sample.input);
      const combinedRuleScore = Math.max(ruleResult.ruleScore, urlAnalysis.urlScore);
      const combinedSignals = Array.from(new Set([...ruleResult.signals, ...urlAnalysis.signals]));

      const mergedRuleResult = {
        ruleScore: combinedRuleScore,
        signals: combinedSignals,
        extractedUrls: [sample.input],
        suggestedCategory: urlAnalysis.details.matchedBrand ? 'BANKING_SCAM' : 'PHISHING'
      };

      const aiResult = await AIService.analyzeText(`Suspicious URL input: ${sample.input}`, mergedRuleResult);
      finalResult = RiskEngine.evaluate(mergedRuleResult, aiResult);
    } else {
      const ruleResult = RuleEngine.analyze(sample.input);
      const aiResult = await AIService.analyzeText(sample.input, ruleResult);
      finalResult = RiskEngine.evaluate(ruleResult, aiResult);
    }

    const predictedScam = finalResult.isScam;

    if (sample.expectedScam && predictedScam) {
      TP++;
      results.push({ sample, result: finalResult, status: 'TP (True Positive)' });
    } else if (!sample.expectedScam && predictedScam) {
      FP++;
      results.push({ sample, result: finalResult, status: 'FP (False Positive)' });
    } else if (!sample.expectedScam && !predictedScam) {
      TN++;
      results.push({ sample, result: finalResult, status: 'TN (True Negative)' });
    } else if (sample.expectedScam && !predictedScam) {
      FN++;
      results.push({ sample, result: finalResult, status: 'FN (False Negative)' });
    }
  }

  const total = BENCHMARK_DATASET.length;
  const precision = (TP + FP) > 0 ? (TP / (TP + FP)).toFixed(4) : '0.0000';
  const recall = (TP + FN) > 0 ? (TP / (TP + FN)).toFixed(4) : '0.0000';
  const accuracy = total > 0 ? ((TP + TN) / total).toFixed(4) : '0.0000';
  const f1 = (parseFloat(precision) + parseFloat(recall)) > 0
    ? (2 * (parseFloat(precision) * parseFloat(recall)) / (parseFloat(precision) + parseFloat(recall))).toFixed(4)
    : '0.0000';

  console.log('--- INDIVIDUAL SAMPLE BREAKDOWN ---');
  results.forEach(({ sample, result, status }) => {
    console.log(`[Sample #${sample.id}] ${sample.category.padEnd(25)} | Expected: ${sample.expectedScam ? 'SCAM' : 'SAFE'} | Predicted: ${result.isScam ? 'SCAM' : 'SAFE'} | Score: ${result.riskScore}/100 | Status: ${status}`);
  });

  console.log('\n================================================================');
  console.log('                 EMPIRICAL METRICS MATRIX                       ');
  console.log('================================================================');
  console.log(`  Total Evaluated Samples : ${total}`);
  console.log(`  True Positives (TP)     : ${TP} (Scams correctly flagged)`);
  console.log(`  True Negatives (TN)     : ${TN} (Safe messages correctly identified)`);
  console.log(`  False Positives (FP)    : ${FP} (Safe messages misidentified as scam)`);
  console.log(`  False Negatives (FN)    : ${FN} (Scams missed)`);
  console.log('----------------------------------------------------------------');
  console.log(`  Accuracy                : ${(parseFloat(accuracy) * 100).toFixed(2)}%`);
  console.log(`  Precision               : ${(parseFloat(precision) * 100).toFixed(2)}%`);
  console.log(`  Recall                  : ${(parseFloat(recall) * 100).toFixed(2)}%`);
  console.log(`  F1 Score                : ${f1}`);
  console.log('================================================================\n');
}

runBenchmark();
