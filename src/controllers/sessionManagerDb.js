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
  
  //Método para verificar la existencia de un usuario
  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      const searchedUser = await userRepository.findOne({ email });

      if (!searchedUser) {
        return res.status(401).send({
          success: false,
          message: "El usuario no fue encontrado. Verificar el email ingresado.",
        });
      }

      //Si el usuario fue encontrado, verifico la contraseña
      if (!isValidPassword(password, searchedUser)) {
        return res
          .status(401)
          .send({ success: false, message: "El password es inválido." });
      }

      //Si la contraseña es correcta, genero el token
      const token = jwt.sign(
        {
          id: searchedUser._id,
          email: searchedUser.email,
          role: searchedUser.role,
        },
        "secretWord",
        {
          expiresIn: "1h",
        }
      );

      //Establezco ese token como cookie
      res.cookie("cookieToken", token, {
        maxAge: 3600000, //Configuro 1 hora de vida para el token
        httpOnly: true, //Restrinjo el acceso a una petición http
        sameSite: "strict",
      });

      //Cuando termina la validación, verifico el rol
      if (searchedUser.role !== "Admin") {
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
          message: `El usuario no fue encontrado.`,
        });

        return res.render("login");
      } else {
        //Si es un usuario registrado, guardo su información
        const user = await userRepository.findById(req.user._id);

        if (!user) {
          return res.status(404).send({ message: "Usuario no encontrado" });
        }
        //Creo un DTO del usuario
        const userDto = new UserDto(user);

        res.render("profile", { userDto });
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
          message:
            "Uups, lo siento! Te faltan los permisos correspondientes para el acceso.",
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para deslogueo
  async logoutUser(req, res) {
    //Limpio la cookie del Token
    res.clearCookie("cookieToken");
    //Redirijo a Login
    res.render("login");
  }
}

module.exports = SessionManager;
