/**
 * Standardized API Response Helper
 */
export class ApiResponse {
  static success(res, message = 'Success', data = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  }

  static error(res, message = 'An error occurred', statusCode = 500, errorDetails = null) {
    const response = {
      success: false,
      message
    };

    if (errorDetails) {
      response.error = errorDetails;
    }

    return res.status(statusCode).json(response);
  }
}
