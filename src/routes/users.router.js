const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

//Ruta para generar un usuario y almacenarlo en MongoDB
router.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;

  try {
    //Validación para chequear si existe el email
    const existUser = await UserModel.findOne({ email: email });

    if (existUser) {
      return res.status(400).send("El email ingresado ya está registrado");
    }

    //Defino el rol de admin y usuario
    const role = email === "admincoder@coder" ? "admin" : "usuario";

    //Creo un nuevo usuario
    const newUser = await UserModel.create({
      first_name,
      last_name,
      email,
      password,
      age,
      role
    });

    //Almaceno info del usuario en la session
    req.session.login = true;
    req.session.user = { ...newUser._doc };
    //Para habilitar vistas con condicionales

    res.redirect("/products");
    // res.status(200).send("El usuario fue creado exitosamente");
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

module.exports = router;
