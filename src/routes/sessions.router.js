const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");

//Ruta para Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    //Validación para chequear si existe el email
    const existUser = await UserModel.findOne({ email: email });

    if (existUser) {
      //Si existe el mail/usuario, chequeo el password
      if (existUser.password === password) {
        //Se crea session
        req.session.login = true;
        req.session.user = {
          email: existUser.email,
          first_name: existUser.first_name,
          last_name: existUser.last_name,
          role: existUser.role,
        };
        //Una vez creada la session, el usuario es redirigido a products
        res.redirect("/products");
      } else {
        res.status(401).send("Password inválido");
      }
    } else {
      res.status(404).send("Email inválido");
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Ruta para Logout
router.get("/logout", (req, res) => {
  if (req.session.login) {
    req.session.destroy();
  }

  res.redirect("/login");
});

module.exports = router;
