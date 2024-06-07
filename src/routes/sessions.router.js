const express = require("express");
const router = express.Router();
const SessionManager = require("../controllers/sessionManagerDb.js");
const sessionTest = new SessionManager();
const passport = require("passport");
const jwt = require("jsonwebtoken");
//Middleware de autenticación con JWT
const authenticateJWT = passport.authenticate("jwt", { session: false });

//Estructuración por capas
router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "./login" }),
  async (req, res) => {
    res.redirect("./profile");
  }
);
router.post("/login", sessionTest.loginUser);
//Ruta para Profile(protegida por jwt)- Ruta Current
router.get("/profile", authenticateJWT, sessionTest.getProfile);
router.get("/admin", authenticateJWT, sessionTest.getAdmin);
router.post("/logout", sessionTest.logoutUser);

module.exports = router;












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
