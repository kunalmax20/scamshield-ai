import { z } from 'zod';

export const textScanSchema = z.object({
  text: z.string().min(3, 'Message must be at least 3 characters long').max(5000, 'Message exceeds 5000 characters limit')
});

export const urlScanSchema = z.object({
  url: z.string().url('Invalid URL format').or(z.string().min(3, 'URL path too short'))
});
