import { z } from 'zod';

export const reportSchema = z.object({
  scanId: z.string().optional(),
  message: z.string().min(5, 'Message content must be at least 5 characters long'),
  category: z.enum([
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
  ]),
  reason: z.string().min(5, 'Reason must be at least 5 characters long')
});

export const updateReportStatusSchema = z.object({
  status: z.enum(['VERIFIED', 'REJECTED'])
});
