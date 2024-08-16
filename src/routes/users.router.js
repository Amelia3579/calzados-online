const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer.js");
const UserController = require("../controllers/user.controller.js");
const userTest = new UserController();

const passport = require("passport");
const jwt = require("jsonwebtoken");
//Middleware de autenticación con JWT
const authenticateJWT = passport.authenticate("jwt", { session: false });

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
router.post("/", userTest.registerUser);
router.post("/login", userTest.loginUser);
//Ruta para Profile(protegida por jwt)- Ruta Current
router.get("/profile", authenticateJWT, userTest.getProfile);
router.get("/admin", authenticateJWT, userTest.getAdmin);
router.post("/logout", userTest.logoutUser);

//------Rutas para Envío de Emails (3° Práctica Integradora)------
router.post("/requestpasswordreset", userTest.requestPasswordReset);
router.post("/resetpassword", userTest.resetPassword);
router.put("/premium/:uid", userTest.premiumRoleChange);

//------Ruta para el cambio de rol del usuario (4° Práctica Integradora)------
router.post(
  "/:uid/documents",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "products", maxCount: 10 },
    { name: "documents", maxCount: 10 },
  ]),
  userTest.uploadDocuments
);

module.exports = router;
