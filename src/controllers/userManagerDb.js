const { cartRepository, userRepository } = require("../services/index.js");
const mongoose = require("mongoose");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

class UserManager {
  //------Lógica para Logger------

  //Método para registrar usuario
  async registerUser(req, res) {
    const { first_name, last_name, email, password, age } = req.body;

    try {
      req.logger.info(
        "Para saber si ya estás registrado, ingresá tu email y contraseña por favor."
      );
      //Verifico si el user ya existe
      const searchedUser = await userRepository.findOne({ email: email });

      if (searchedUser) {
        req.logger.warning("El email ingresado ya existe");
        return res.status(200).json({
          success: true,
          message: "El usuario ingresado ya existe.",
          redirect: "/api/sessions/profile",
        });
      }
      req.logger.info(
        "Para que quedes registrado, completá todos los campos del formulario."
      );

      //Si no existe, creo un usuario nuevo, al cual se asociará un nuevo carrito
      let newCart = await cartRepository.addCart();

      //Defino el rol de usuario y admin
      const role = email === "adminapp@gmail.com" ? "Admin" : "User";

      const newUser = await userRepository.addUser({
        first_name,
        last_name,
        email,
        password: createHash(password),
        age,
        role,
        //Al nuevo usuario, vinculo el id del carrito nuevo
        cart: newCart._id,
      });
      req.logger.info(`Ya fuiste registrado, con el email: ${newUser.email}`);
      //Genero el token
      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role,
        },
        "secretWord",
        { expiresIn: "1h" }
      );

      //Establezco el token como cookie en el servidor
      res.cookie("cookieToken", token, {
        maxAge: 3600000, //Configuro 1 hora de vida para el token
        httpOnly: true, //Restrinjo el acceso a una petición http
      });

      //Cuando termine la operación de registro, se redirige a profile
      res.redirect("/api/sessions/profile");
    } catch (error) {
      req.logger.error("Error en el proceso de registro:", error);
      return res.status(500).send({ message: error.message });
    }
  }
}

module.exports = UserManager;
