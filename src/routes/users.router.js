const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
const { createHash } = require("../utils/hashbcrypt.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

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
// router.post(
//   "/",
//   passport.authenticate("register", {
//     failureRedirect: "/failedregister",
//   }),
//   async (req, res) => {
//     if (!req.user) {
//       return res.status(400).send("Las credenciales son inválidas");
//     }
//     req.session.user = {
//       first_name: req.user.first_name,
//       last_name: req.user.last_name,
//       age: req.user.age,
//       email: req.user.email,
//       id: req.user._id,
//       cart: req.user.cart,
//     };
//     req.session.login = true;
//     res.redirect("/profile");
//   }
// );

// router.get("/failedregister", (req, res) => {
//   res.send("Registro fallido");
// });

//Ruta para JWT

router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;

  try {
    //Verifico si el user ya existe
    const existUser = await UserModel.findOne({ email: email });

    if (existUser) {
      return res.status(400).send("El usuario ingresado ya existe");
    }

    //Si no existe, creo un usuario nuevo, al cual se asociará un nuevo carrito
    let newCart = await CartModel.create({ products: [] });

    //Defino el rol de usuario y admin
    const role = email === "adminapp@gmail.com" ? "admin" : "usuario";

    const newUser = new UserModel({
      first_name,
      last_name,
      email,
      password: createHash(password),
      age,
      role,
      //Al nuevo usuario, vinculo el id del carrito nuevo
      cart: newCart._id,
    });

    //Lo guardo en la base de datos
    await newUser.save();

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
      //Configuro 1 hora de vida para el token
      maxAge: 3600000,
      //Restrinjo el acceso a una petición http
      httpOnly: true,
    });

    //Cuando termine la operación de registro, se redirige a profile
    res.redirect("/api/sessions/profile");
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

module.exports = router;
