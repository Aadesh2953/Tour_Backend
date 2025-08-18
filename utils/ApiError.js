export default class ApiError extends Error {
  constructor(statusCode, message) {
    console.log("statusCode", statusCode);
    console.log("message", message);
    super(message);
    this.statusCode = statusCode;
    this.status = this.statusCode;
    this.isOpertional = true;
    Error.captureStackTrace(this, this.constructor);
  }
}
