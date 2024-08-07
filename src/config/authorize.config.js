const passport = require("passport");

//Middleware de autorización para rol de admin
const authorize = (role) => {
  return (req, res, next) => {
    if (req.user && req.user.role === role) {
      next();
    } else {
      res
        .status(403)
        .json({
          success: false,
          message: "Permits are missing to carry out the operation.",
        });
    }
  };
};

module.exports = authorize;
