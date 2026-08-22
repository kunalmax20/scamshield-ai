import { ApiResponse } from '../utils/apiResponse.js';

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return ApiResponse.error(res, 'Access denied. Admin authorization required.', 403);
};
