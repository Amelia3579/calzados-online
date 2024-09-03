const { cartRepository, userRepository } = require("../services/index.js");
const mongoose = require("mongoose");
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const UserDto = require("../dtos/user.dto.js");
const { generateResetToken } = require("../utils/tokenreset.js");

const EmailController = require("../services/email.js");
const emailTest = new EmailController();
const upload = require("../middleware/multer.js");

class UserController {
  //------Lógica para Logger------

  //Método para registro de un usuario
  async registerUser(req, res = null) {
    const { first_name, last_name, email, password, age } = req.body || req;

    try {
      req.logger.info(
        "To find out if you are already registered, please enter your email and password."
      );
      //Verifico si el user ya existe
      const user = await userRepository.findOne({ email: email });

      if (user) {
        req.logger.warning("The email entered already exists");
        return res.status(200).send({
          success: true,
          message: "The user entered already exists.",
          redirect: "/api/users/profile",
        });
      }
      req.logger.info(
        "In order to register, all fields in the form must be completed.."
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
      req.logger.info(
        `You have already been registered, with the email: ${newUser.email}`
      );
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

      const response = {
        success: true,
        message: "User registered successfully.",
        payload: newUser,
      };

      if (res) {
        res.cookie("cookieToken", token, {
          maxAge: 3600000,
          httpOnly: true,
        });
        return res.redirect("/api/users/profile");
      } else {
        return response;
      }
    } catch (error) {
      req.logger.error("Error in the registration process:", error);
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
      return res.redirect("/api/users/profile");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para obtener todos los usuarios
  async getUsers(req, res) {
    try {
      const users = await userRepository.find();

      //Creo DTO para los usuarios
      const usersDto = users.map((user) => new UserDto(user));

      if (!users) {
        res.status(401).send({
          success: false,
          message: "Users cannot be displayed.",
        });
      }

      return res.status(200).send({
        success: true,
        message: "Registered users are:",
        users: usersDto,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para eliminar usuarios inactivos
  async deleteInactiveUsers(req, res) {
    const userId = req.params.id;

    // Establezco tiempo límite de inactividad
    const lastConnectionLimit = new Date(Date.now() - 5 * 60 * 1000);

    try {
      const user = await userRepository.findById(userId);

      if (!user) {
        return res.status(404).send({
          success: false,
          message: "User not found.",
        });
      }

      if (new Date(user.last_connection) >= lastConnectionLimit) {
        return res.status(400).send({
          success: false,
          message: "User has not been inactive for 5 minutes.",
        });
      }
      const deletedUser = await userRepository.findByIdAndDelete(userId);

      // Envio email al usuario eliminado
      if (!deletedUser) {
        return res.status(500).send({
          success: false,
          message: "Failed to delete the user.",
        });
      }

      emailTest.sendEmailNotification(deletedUser.first_name);
      res.status(200).send({
        success: true,
        message: "User successfully deleted.",
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
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
        const isAdmin = req.user.role === "Admin";
        const isPremium = req.user.role === "Premium";

        //Creo un DTO del usuario
        const userDto = new UserDto(user);

        if (req.headers["content-type"] === "application/json") {
          return res.status(200).send({
            success: true,
            payload: userDto,
          });
        } else {
          return res.render("profile", { userDto, isAdmin, isPremium });
        }
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para admin.handlebars
  async getAdmin(req, res) {
    try {
      const user = await userRepository.findById(req.user._id);

      if (user.role === "Admin") {
        const users = await userRepository.find();

        const formattedUsers = users.map((user) => {
          let formattedDate = "Not available"; // Valor por defecto en caso de que last_connection no esté disponible

          if (user.last_connection) {
            const date = new Date(user.last_connection);
            if (!isNaN(date.getTime())) {
              // Verifico si la fecha es válida
              formattedDate = new Intl.DateTimeFormat("es-ES", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
              }).format(date);
            }
          }

          // Retorno un nuevo objeto usuario con la fecha formateada
          return {
            ...user,
            last_connection: formattedDate,
          };
        });

        return res.render("admin", {
          users: formattedUsers,
          userId: req.user._id,
        });
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
    return res.redirect("/");
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
        return res.status(404).send("User not found. You need to register.");
      }

      //Si se encuentra usuario, genero un token
      const token = generateResetToken();

      //Agrego el token al usuario
      user.resetToken = {
        token: token,
        expire: new Date(Date.now() + 3600000),
      };
      await user.save();

      //Luego de guardar los cambios, envío el email
      await emailTest.sendEmailReset(user.first_name, token);

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
          error: "No user was found with the entered email.",
        });
      }

      //Si se encuentra usuario, verifico el  token
      const resetToken = user.resetToken;

      if (!resetToken || resetToken.token !== token) {
        return res.render("changepassword", {
          error: "The token entered is invalid.",
        });
      }

      //Verifico la duración del token
      const tokenDuration = new Date();

      if (tokenDuration > resetToken.expire) {
        return res.render("changepassword", {
          error: "The token entered was expired.",
        });
      }

      //Verifico que la nueva contraseña sea distinta a la anterior
      if (isValidPassword(password, user)) {
        return res.render("resetpassword", {
          error: "The new password must be different from the previous one..",
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

  //Método para que el usuario suba documentos
  async uploadDocuments(req, res) {
    const { uid } = req.params;
    const uploadedFiles = req.files;
    
    try {
      const user = await userRepository.findOne({ _id: uid });

      if (!user) {
        return res.status(404).send("The user not found.");
      }

      // Inicializar user.documents si es undefined
      if (!user.documents) {
        user.documents = [];
      }

      if (uploadedFiles) {
        // Verifico y almaceno cada tipo de documento
        if (uploadedFiles.profile) {
          user.documents = user.documents.concat(
            uploadedFiles.profile.map((doc) => ({
              type: "profile",
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }

        if (uploadedFiles.products) {
          user.documents = user.documents.concat(
            uploadedFiles.products.map((doc) => ({
              type: "products",
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }

        if (uploadedFiles.documents) {
          user.documents = user.documents.concat(
            uploadedFiles.documents.map((doc) => ({
              type: "documents",
              name: doc.originalname,
              reference: doc.path,
            }))
          );
        }
      }
      await user.save();

      res
        .status(200)
        .send({ message: "Documents uploaded successfully.", user });
    } catch (error) {
      res.status(500).send({ message: error.message });
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
        return res.status(404).send("The user not found.");
      }

      // Inicializo user.documents
      if (!user.documents) {
        user.documents = [];
      }

      // Verifico si el usuario envió toda la documentación:
      const requiredDocumentation = [
        "identificacion",
        "comprobanteDomicilio",
        "comprobanteEstadoDeCuenta",
      ];

      const userDocuments = user.documents.map((doc) =>
        doc.name.split(".").slice(0, -1).join(".")
      );
      

      const completeDocumentation = requiredDocumentation.every((doc) =>
        userDocuments.includes(doc)
      );
      if (!completeDocumentation) {
        return res
          .status(400)
          .send("The user must complete all the required documentation.");
      }

      //Verifico el tiempo en que fue enviada la documentación
      const maxUploadAgeInDays = 30;
      const currentDate = new Date();

      const oldDocuments = user.documents.filter((doc) => {
        // Uso la fecha del ObjectId del documento
        const uploadDate = new Date(doc._id.getTimestamp());
        const ageInDays = (currentDate - uploadDate) / (1000 * 60 * 60 * 24);
        return ageInDays > maxUploadAgeInDays;
      });

      if (oldDocuments.length > 0) {
        return res
          .status(400)
          .send(
            "One or more documents are too old and need to be re-uploaded."
          );
      }

      //Si fue enviada toda la documentación y dentro de los últimos 30 días, cambio el rol
      const newRole = user.role === "User" ? "Premium" : "User";

      const updateRole = await userRepository.findByIdAndUpdate(uid, {
        role: newRole,
      });
      
      return res.status(200).send({
        success: true,
        message: "The role was successfully updated.",
        user: updateRole,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}
module.exports = UserController;
