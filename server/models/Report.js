import mongoose from 'mongoose';

const reportSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    },
    scanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Scan',
      default: null
    },
    message: {
      type: String,
      required: [true, 'Message content is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
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
      ]
    },
    reason: {
      type: String,
      required: [true, 'Reason for reporting is required'],
      trim: true
    },
    status: {
      type: String,
      enum: ['PENDING', 'VERIFIED', 'REJECTED'],
      default: 'PENDING',
      index: true
    },
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const Report = mongoose.model('Report', reportSchema);
