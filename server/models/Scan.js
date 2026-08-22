import mongoose from 'mongoose';

const scanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true
    },
    inputType: {
      type: String,
      enum: ['TEXT', 'IMAGE', 'URL'],
      required: true
    },
    originalText: {
      type: String,
      required: true
    },
    extractedText: {
      type: String,
      default: null
    },
    urls: [
      {
        type: String
      }
    ],
    isScam: {
      type: Boolean,
      required: true
    },
    riskScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    riskLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      required: true
    },
    category: {
      type: String,
      enum: [
        'BANKING_SCAM',
        'PHISHING',
        'UPI_SCAM',
        'OTP_SCAM',
        'JOB_SCAM',
        'LOTTERY_SCAM',
        'DELIVERY_SCAM',
        'INVESTMENT_SCAM',
        'GOVERNMENT_IMPERSONATION',
        'TECH_SUPPORT_SCAM',
        'ROMANCE_SCAM',
        'ACCOUNT_TAKEOVER',
        'OTHER'
      ],
      required: true
    },
    signals: [
      {
        type: String
      }
    ],
    explanation: {
      type: String,
      required: true
    },
    recommendation: {
      type: String,
      required: true
    },
    ruleScore: {
      type: Number,
      default: 0
    },
    aiScore: {
      type: Number,
      default: 0
    },
    urlScore: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

export const Scan = mongoose.model('Scan', scanSchema);
