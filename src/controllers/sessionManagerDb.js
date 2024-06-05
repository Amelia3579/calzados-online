const UserModel = require("../models/user.model.js");
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

  //Método para verificar la existencia de un usuario
  async loginUser(req, res) {
    const { email, password } = req.body;

    try {
      //Verifico si el user ya existe en la base de datos
      const userFound = await UserModel.findOne({ email }).lean();
      if (!userFound) {
        return res.status(401).send("El usuario no fue encontrado");
      }

      //Si el usuario fue encontrado, verifico la contraseña
      if (!isValidPassword(password, userFound)) {
        return res.status(401).send("Password inválido");
      }

      //Si la contraseña es correcta, genero el token
      const token = jwt.sign(
        { id: userFound._id, email: userFound.email, role: userFound.role },
        "secretWord",
        {
          expiresIn: "1h",
        }
      );

      //Establezco el token como cookie
      res.cookie("cookieToken", token, {
        maxAge: 3600000, //Configuro 1 hora de vida para el token
        httpOnly: true, //Restrinjo el acceso a una petición http
      });

      //Cuando termina la validación, verifico el rol
      if (userFound.role !== "admin") {
        return res.redirect("/products");
      }

      return res.redirect("./admin");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para register.handlebars
  async getRegister(req, res) {
    //Validación para chequear si el usuario está logueado, si es asi, redirijo al perfil
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
        return res.render("login");
      }
      //Si es un usuario registrado, guardo su información
      const user = await UserModel.findById(req.user._id).lean();

      res.render("profile", { user });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para admin.handlebars
  async getAdmin(req, res) {
    const user = await UserModel.findById(req.user._id).lean();

    try {
      if (user.role === "admin") {
        return res.render("admin", { user });
      } else {
        return res
          .status(403)
          .send(
            "Uups, lo siento! Te faltan los permisos correspondientes para el acceso."
          );
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
