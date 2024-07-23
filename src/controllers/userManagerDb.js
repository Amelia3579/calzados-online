const { cartRepository, userRepository } = require("../services/index.js");
const mongoose = require("mongoose");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const { generateResetToken } = require("../utils/tokenreset.js");
const EmailManager = require("../services/email.js");
const emailManager = new EmailManager();

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

      // Determino el rol del usuario según el email
      let role;
      if (email === "adminapp@gmail.com") {
        role = "Admin";
      } else if (email.includes("premium")) {
        role = "Premium";
      } else {
        role = "User";
      }

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
        httpOnly: true, //Limito el acceso sólo a una petición http
      });

      //Cuando termine la operación de registro, se redirige a profile
      res.redirect("/api/sessions/profile");
    } catch (error) {
      req.logger.error("Error en el proceso de registro:", error);
      return res.status(500).send({ message: error.message });
    }
  }

  //------Lógica para envío de emails y cambio de rol (3° Práctica Integradora)------
  async requestPasswordReset(req, res) {
    //Recibo el email del usuario
    const { email } = req.body;

    try {
      //Busco al usuario por email
      const user = await userRepository.findOne({ email });

      if (!user) {
        //Si no hay usuario, la ejecución termina
        return res
          .status(404)
          .send("No se encontró usuario. Hace falta que te registres.");
      }

      //Si se encuentra usuario, genero un token
      const token = generateResetToken();

      //Agrego el token al usuario
      user.resetToken = {
        token: token,
        expire: new Date(Date.now() + 3600000), //Le doy 1 hora de duración
      };
      await user.save();

      //Luego de guardar los cambios, envío el email
      await emailManager.sendEmailReset(user.first_name, token);

      res.redirect("/shippingconfirmation");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para resetear la contraseña
  async resetPassword(req, res) {
    //Recibo el email, password y el token que me envía el form de changepassword.handlebars
    const { email, password, token } = req.body;

    try {
      //Busco al usuario por email para corroborar el token
      const user = await userRepository.findOne({ email });

      //Si no hay usuario, lo envío nuevamente a que cargue sus datos
      if (!user) {
        return res.render("resetpassword", {
          error: "No se encontró usuario con el email ingresado.",
        });
      }

      //Si se encuentra usuario, verifico el  token
      const resetToken = user.resetToken;

      if (!resetToken || resetToken.token !== token) {
        return res.render("changepassword", {
          error: "El token ingresado es inválido. Generá otro por favor.",
        });
      }

      //Verifico la duración del token
      const tokenDuration = new Date();

      if (tokenDuration > resetToken.expire) {
        return res.render("changepassword", {
          error: "El token ingresado ha caducado.",
        });
      }

      //Verifico que la nueva contraseña sea distinta a la anterior
      if (isValidPassword(password, user)) {
        return res.render("resetpassword", {
          error: "La nueva contraseña tiene que ser distinta a la anterior.",
        });
      }
      //Actualizo la contraseña
      user.password = createHash(password);

      //Marco el token como que fue usado
      user.resetToken = undefined;
      await user.save();

      //Redirecciono a Login para ingresar la nueva contraseña
      return res.redirect("/");
    } catch (error) {
      res.status(500).render("changepassword", { message: error.message });
    }
  }

  //Método para cambiar el rol del usuario
  async premiumRoleChange(req, res) {
    //Recibo el id del usuario
    const { uid } = req.params;

    try {
      //Busco al usuario
      const user = await userRepository.findById(uid);

      if (!user) {
        return res.status(404).send("El usuario no fue encontrado.");
      }

      //Si lo encuentro,le cambio el rol
      const newRole = user.role === "User" ? "Premium" : "User";

      const updateRole = await userRepository.findByIdAndUpdate(uid, {
        role: newRole,
      });

      return res.status(200).json({
        success: true,
        message: "El rol fue actualizado exitosamente.",
        user: JSON.parse(JSON.stringify(updateRole, null, 2)),
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}
module.exports = UserManager;
