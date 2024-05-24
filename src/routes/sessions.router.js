const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcrypt.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");
//Ruta para Login
// router.post("/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     //Validación para chequear si existe el email
//     const existUser = await UserModel.findOne({ email: email });

//     if (existUser) {
//       //Si existe el mail/usuario, chequeo el password
//       // if (existUser.password === password)

//       //Si existe el mail/usuario, chequeo el password usando BCRYPT
//       if (isValidPassword(password, existUser)) {
//         //Se crea session
//         req.session.login = true;
//         req.session.user = {
//           email: existUser.email,
//           first_name: existUser.first_name,
//           last_name: existUser.last_name,
//           role: existUser.role,
//         };
//         //Una vez creada la session, el usuario es redirigido a perfil
//         res.redirect("/profile");
//       } else {
//         res.status(401).send("Password inválido");
//       }
//     } else {
//       res.status(404).send("Usuario no encontrado");
//     }
//   } catch (error) {
//     return res.status(500).send({ message: error.message });
//   }
// });

//Ruta versión para Passport
// router.post(
//   "/login",
//   passport.authenticate("login", {
//     failureRedirect: "/api/sessions/faillogin",
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
//     };
//     req.session.login = true;
//     res.redirect("/profile");
//   }
// );

// router.get("/faillogin", async (req, res) => {
//   res.send("Falló el logueo");
// });

//Ruta versión para Github
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirec: "/login" }),
  async (req, res) => {
    //Esta estrategia nos retornará el usuario, entonces los agrego a mi objeto de session
    req.session.user = req.user;
    req.session.login = true;
    res.redirect("/profile");
  }
);

//Ruta para JWT
router.post("/login", async (req, res) => {
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
      { id: userFound._id, email: userFound.email },
      "secretWord",
      {
        expiresIn: "1h",
      }
    );

    //Establezco el token como cookie
    res.cookie("cookieToken", token, {
      //Configuro 1 hora de vida para el token
      maxAge: 3600000,
      //Restrinjo el acceso a una petición http
      httpOnly: true,
    });
    //Cuando termine la operación de registro, se redirige a profile
    res.redirect("/products");
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Ruta para Logout
router.post("/logout", (req, res) => {
  //Limpio la cookie del Token
  res.clearCookie("cookieToken");
  //Redirijo a Login
  res.redirect("/login");
});

module.exports = router;
