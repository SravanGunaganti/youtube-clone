import { sendErrorResponse } from "../utils/sendErrorResponse.js";

// Handles malformed JSON payloads in requests
export const malformedJSONHandler = (err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    console.error("Bad JSON:", err.message);
    return sendErrorResponse(
      res,
      400,
      "Invalid JSON",
      "The JSON payload is malformed. Please check your request body syntax."
    );
  }
  next(err);
};

// Handles mongoose validations
export const mongooseValidationHandler = (err, req, res, next) => {
  if (err.name === "ValidationError") {
    console.error("Mongoose Validation Error:", err.message);
    return sendErrorResponse(
      res,
      400,
      "Validation Error",
      Object.values(err.errors)
        .map((e) => e.message)
        .join(", ")
    );
  }
  next(err);
};

// handles requests to undefined routes (404 Not Found)
export const invalidRouteHandler = (req, res) => {
  return sendErrorResponse(
    res,
    404,
    "Invalid Route",
    `The requested route '${req.originalUrl}' does not exist.`
  );
};

// Catches and handles all unhandled or server errors (500 Internal Server Error)
export const globalErrorHandler = (err, req, res, next) => {
  return sendErrorResponse(
    res,
    500,
    "Internal Server Error",
    err.message || "Something went wrong on the server. Please try again later"
  );
};
