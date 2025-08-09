export const sendErrorResponse = (res, statusCode, title, message) => {
  return res.status(statusCode).json({
    success: false,
    statusCode,
    error: {
      title,
      message,
    },
  });
};

export const sendSuccessResponse = (res, status = 200, data = null, message = "", token = "") => {
    const response = {
        success: true,
        status,
    };
    
    if (data !== null) {
        response.data = data;
    }
    if (message) {
        response.message = message;
    }
    if (token) {
        response.accessToken = token;
    }
    return res.status(status).json(response);
};