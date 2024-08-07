const jwtSocket = require("jsonwebtoken");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();

//Verifico el rol del usuario
const verifyRole = (roles) => {
  return async (req, res, next) => {
    const token = req.cookies.cookieToken;

    //Verifico si se ingresa un token
    if (!token) {
      return res.status(403).send("Token not yet entered.");
    }

    try {
      //Verifico si el token que se ingresó es válido
      const decoded = jwtSocket.verify(token, "secretWord");
      const userId = decoded.id;

      if (!userId) {
        return res.status(403).send("The token is invalid.");
      }

      //Verifico el rol del usuario
      const user = await userRepository.findById(userId);

      if (!user || !roles.includes(user.role)) {
        return res
          .status(403)
          .send(
            "The token entered does not have the necessary permissions to perform this operation."
          );
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error verifying token:", error.message);
      return res.status(403).send("The token is invalid.");
    }
  };
};
module.exports = verifyRole;
