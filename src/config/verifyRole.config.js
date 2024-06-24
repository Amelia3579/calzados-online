const jwtSocket = require("jsonwebtoken");
const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();

//Verifico el rol del usuario
const verifyRole = (roles) => {
  return async (req, res, next) => {
    const token = req.cookies.cookieToken;

    //Verifico si se ingresa un token
    if (!token) {
      res.status(403).send("Falta ingresar el token.");
    }

    try {
      //Verifico si el token que se ingresó es válido
      const decoded = jwtSocket.verify(token, "secretWord");
      const userId = decoded.id;

      if (!userId) {
        return res.status(403).send("El token que se ingresó es inválido.");
      }

      //Verifico el rol del usuario
      const user = await userRepository.findById(userId);

      if (!user || !roles.includes(user.role)) {
        return res
          .status(403)
          .send(
            "El token que se ingresó no cuenta con los permisos necesarios para realizar esta operación."
          );
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error al verificar el token:", error.message);
      return res.status(403).send("El token ingresado es inválido.");
    }
  };
};
module.exports = verifyRole;
