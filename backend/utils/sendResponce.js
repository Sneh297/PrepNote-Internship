const sendResponse = (res, statusCode, success, message, data = null) => {
  const responseObj = {
    success,
    message,
    data,
  };

  return res.status(statusCode).json(responseObj);
};

module.exports = sendResponse;
