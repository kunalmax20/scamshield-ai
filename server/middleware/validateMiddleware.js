import { ZodError } from 'zod';
import { ApiResponse } from '../utils/apiResponse.js';

export const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      const formattedErrors = error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message
      }));
      return ApiResponse.error(res, 'Validation Error', 400, formattedErrors);
    }
    next(error);
  }
};
