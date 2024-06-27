const { dictionaryError } = require("../services/errors/enum.js");

const handleError = (error, req, res, next) => {
  switch (error.code) {
    case dictionaryError.INVALID_TYPES_ERROR:
      res.send({
        status: "error",
        error: error.name,
        details: error.cause
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0),
      });
      break;
    default:
      res.status(500).send({
        status: "error",
        error: "Error desconocido.",
        details: error.cause
          .split("\n")
          .map((line) => line.trim())
          .filter((line) => line.length > 0),
      });
  }
};

module.exports = handleError;
