const passport = require("passport");
const local = require("passport-local");

//Estrategia con Github
const GitHubStrategy = require("passport-github2");
const UserModel = require("../models/user.model.js");
//Importo las funciones auxiliares para hashear las contraseñas
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

//Creo la estrategia de Passport
const LocalStrategy = local.Strategy;

const initializePassport = () => {
  //Estrategia para registro
  passport.use(
    "register",
    new LocalStrategy(
      {
        //Acceso al objeto request
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          //Validación para chequear si existe un registro con ese mail
          let user = await UserModel.findOne({ email });

          if (user) {
            return done(null, false);
          }

          //Si no existe, creo un registro de usuario nuevo
          let newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };

          let result = await UserModel.create(newUser);
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Estrategia para login
  passport.use(
    "login",
    new LocalStrategy(
      {
        usernameField: "email",
      },
      async (email, password, done) => {
        try {
          //Validación para chequear si existe un usuario con ese mail
          let user = await UserModel.findOne({ email });

          if (!user) {
            console.log("El usuario ingresado no existe");
            return done(null, false);
          }

          //Si existe el usuario, valido el password
          if (!isValidPassword(password, user)) {
            return done(null, false);
          }

          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  //Serializo y Deserializo
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let userDes = await UserModel.findOne({ _id: id });
    done(null, userDes);
  });

  //Estrategia para Github
  passport.use(
    "github",
    new GitHubStrategy(
      {
        clientID: "Iv23licrAjJXehMHsWyb",
        clientSecret: "e2f9c742ad7fdf4bf5ccc11c192e8a8ed5312d17",
        callbackURL: "http://localhost:8080/api/sessions/githubcallback",
      },
      async (accessToken, refreshToken, profile, done) => {
        //Datos del perfil
        console.log("Profile:", profile);

        try {
          let userGith = await UserModel.findOne({
            email: profile._json.email,
          });

          if (!userGith) {
            let newUser = {
              first_name: profile._json.name,
              last_name: "",
              age: 47,
              email: profile._json.email,
              password: "",
            };

            //Guardo en MongoDB
            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            //Envío el usuario
            done(null, userGith);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

module.exports = initializePassport;
