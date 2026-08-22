import { createWorker } from 'tesseract.js';

export class OCRService {
  static async extractText(imageBuffer) {
    if (!imageBuffer) {
      throw new Error('No image buffer provided for OCR processing.');
    }

    let worker = null;
    try {
      // Initialize Tesseract worker for English text recognition
      worker = await createWorker('eng');
      const ret = await worker.recognize(imageBuffer);
      await worker.terminate();

      const rawText = ret.data.text || '';
      const cleanText = this.cleanExtractedText(rawText);

      return {
        rawText,
        cleanText,
        confidence: ret.data.confidence || 0
      };
    } catch (error) {
      if (worker) {
        try {
          await worker.terminate();
        } catch (e) {
          // ignore termination error
        }
      }
      console.error('[OCRService] Failed to extract text from image:', error.message);
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }

  static cleanExtractedText(text) {
    if (!text) return '';

    return text
      .replace(/[\r\n]+/g, ' ') // Replace line breaks with single space
      .replace(/\s+/g, ' ') // Normalize spaces
      .trim();
  }
}
