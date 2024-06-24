const { cartRepository, userRepository } = require("../services/index.js");
const mongoose = require("mongoose");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

class UserManager {
  //Método para registrar usuario
  async registerUser(req, res) {
    const { first_name, last_name, email, password, age } = req.body;

    try {
      //Verifico si el user ya existe
      const searchedUser = await userRepository.findOne({ email: email });

      if (searchedUser) {
        return res.status(200).json({
          success: true,
          message: "El usuario ingresado ya existe.",
          redirect: "/api/sessions/profile",
        });
      }
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
      return res.status(500).send({ message: error.message });
    }
  }
}

module.exports = UserManager;
