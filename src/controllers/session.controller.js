const { userRepository } = require("../services/index.js");
const UserDto = require("../dtos/user.dto.js");
const mongoose = require("mongoose");
const { isValidPassword } = require("../utils/hashbcrypt.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

class SessionManager {
  //Método para que cuando cargue la app, login sea lo 1° que aparezca
  async getLoguin(req, res) {
    try {
      res.render("login");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //------Lógica para Logger------

  //Método para logueo de un usuario
  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const user = await userRepository.findOne({ email });

      if (!user) {
        return res.status(401).send({
          success: false,
          message: "The user was not found. Please check the email entered..",
        });
      }

      //Si el usuario fue encontrado, verifico la contraseña
      if (!isValidPassword(password, user)) {
        return res
          .status(401)
          .send({ success: false, message: "The password is invalid." });
      }

      //Si la contraseña es correcta, genero el token
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        },
        "secretWord",
        {
          expiresIn: "1h",
        }
      );

      //------Lógica para la propiedad last_connection (4° Práctica Integradora)------
      user.last_connection = new Date();
      await user.save();

      //Establezco ese token como cookie
      res.cookie("cookieToken", token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: "strict",
      });

      //Cuando termina la validación, verifico el rol
      if (user.role !== "Admin") {
        return res.redirect("/products");
      }

      return res.redirect("./admin");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para register.handlebars
  async getRegister(req, res) {
    //Validación para chequear si el usuario está logueado, si es así, redirijo al perfil
    if (req.user) {
      return res.redirect("/profile");
    }
    res.render("register");
  }

  //Método para profile.handlebars
  async getProfile(req, res) {
    try {
      // Verifico si el usuario está autenticado
      if (!req.user) {
        // Si no está autenticado, redirijo a Login
        res.status(401).send({
          success: false,
          message: `The user was not found..`,
        });

        return res.render("login");
      } else {
        //Si es un usuario registrado, guardo su información
        const user = await userRepository.findById(req.user._id);

        //Creo un DTO del usuario
        const userDto = new UserDto(user);

        if (req.headers["content-type"] === "application/json") {
          return res.status(200).send({
            success: true,
            payload: userDto,
          });
        } else {
          return res.render("profile", { userDto });
        }
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para admin.handlebars
  async getAdmin(req, res) {
    try {
      const searchedUser = await userRepository.findById(req.user._id);

      if (searchedUser.role === "Admin") {
        return res.render("admin", { searchedUser });
      } else {
        return res.status(403).send({
          success: false,
          message: "You are missing the corresponding permissions for access.",
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //------Lógica para la propiedad last_connection (4° Práctica Integradora)------

  //Método para deslogueo
  async logoutUser(req, res) {
    if (req.user) {
      try {
        req.user.last_connection = new Date();
        await req.user.save();
      } catch (error) {
        res.status(500).send({ message: error.message });
      }
    }
    //Limpio la cookie del Token
    res.clearCookie("cookieToken");
    //Redirijo a Login
    res.render("login");
  }
}

module.exports = SessionManager;
