const { dictionaryError } = require("../services/errors/enum.js");

const handleError = (error, req, res, next) => {
  switch (error.code) {
    case dictionaryError.INVALID_TYPES_ERROR:
      res.send({
        status: "error",
        error: error.name,
        cause: error.cause
      });
      break;
    default:
      res.status(500).send({
        status: "error",
        error: "Unknown error.",
        cause: error.cause
      });
  }
};

module.exports = handleError;
