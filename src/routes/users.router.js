const express = require("express");
const router = express.Router();
// const UserModel = require("../models/user.model.js");
// const { createHash } = require("../utils/hashbcrypt.js");
const passport = require("passport");

//Ruta para generar un usuario y almacenarlo en MongoDB
// router.post("/", async (req, res) => {
//   const { first_name, last_name, email, password, age } = req.body;

//   try {
//     //Validación para chequear si existe el email
//     const existUser = await UserModel.findOne({ email: email });

//     if (existUser) {
//       return res.status(400).send("El email ingresado ya está registrado");
//     }

//     //Defino el rol de admin y usuario
//     const role = email === "admincoder@coder" ? "admin" : "usuario";

//     //Creo un nuevo usuario
//     const newUser = await UserModel.create({
//       first_name,
//       last_name,
//       email,
//       password: createHash(password),
//       age,
//       role
//     });

//     //Una vez creado el usuario, puedo crear la session
//     req.session.login = true;
//     req.session.user = { ...newUser._doc };

//     res.redirect("/products");
//     // res.status(200).send("El usuario fue creado exitosamente");
//   } catch (error) {
//     return res.status(500).send({ message: error.message });
//   }
// });

//Ruta versión para Passport
//(Estrategia Local)
router.post(
  "/",
  passport.authenticate("register", {
    failureRedirect: "/failedregister",
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(400).send("Las credenciales son inválidas");
    }
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };
    req.session.login = true;
    res.redirect("/profile");
  }
);

router.get("/failedregister", (req, res) => {
  res.send("Registro fallido");
});

module.exports = router;
