export const apiErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "Fail";
  if (err.name == "CastError") {
    handleDbError(err, res);
    return;
  }

  if (err.name == "JsonWebTokenError") {
    handleJSONWebTokenError(err, res);
    return;
  }

  if (process.env.NODE_ENV == "development") {
    development(err, res);
    return;
  }
  if (process.env.NODE_ENV == "production") {
    handleProductionError(err, res);
    return;
  }
};
export const development = (err, res) => {
  // console.log("error is Here");
  if (err.status != 401)
    return res.status(500).json({
      status: "Fail",
      message: err.message,
      stack: err.stackTrace,
    });
  else
    return res.status(err.status).json({
      status: "Fail",
      message: err.message,
    });
};
export const production = (err, res) => {
  if (err.status != 401)
    return res.status(500).json({
      status: "Fail",
      message: message,
    });
};
export const handleDbError = (err, res) => {
  res.status(500).json({
    status: "Fail",
    message: "Something went wrong!!!",
  });
};
export const handleJSONWebTokenError = (err, res) => {
  return res.status(500).json({
    status: "Fail",
    message: "Invalid Token!!!",
  });
};
export const handleProductionError = (err, res) => {
  return res.status(500).json({
    status: "Fail",
    message: "Something Went Wrong!",
  });
};
