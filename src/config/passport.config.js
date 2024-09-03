const passport = require("passport");
const jwt = require("passport-jwt");

////Extraigo algunos archivos de los módulos passport.jwt
const JWTStrategy = jwt.Strategy;
const ExtractJwt = jwt.ExtractJwt;

//Estrategia con Github
const GitHubStrategy = require("passport-github2");
const UserModel = require("../models/user.model.js");
const CartModel = require("../models/cart.model.js");
//Importo las funciones auxiliares para hashear las contraseñas
const { createHash, isValidPassword } = require("../utils/hashbcrypt.js");

const initializePassport = () => {
  //Estrategia para jwt
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        //Paso objeto de configuración
        //Extraigo el token de la solicitud para verificarlo, si es válido busco el usuario correspondiente
        jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
        secretOrKey: "secretWord",
      },
      //Función cb para recuperar la data del usuario (payload)
      async (jwt_payload, done) => {
        try {
          const user = await UserModel.findById(jwt_payload.id).lean();

          if (user) {
            //Si el usuario es válido, retorno la data
            return done(null, user);
          } else {
            return done(null, false);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};

//Configuro mi extractor de cookie
const cookieExtractor = (req) => {
  let token = null;

  //Si hay request y si existen las cookies, el token estará cargado con esta cookie
  if (req && req.cookies) {
    token = req.cookies["cookieToken"];
  }
  return token;
};

//Estrategia para Github

const clientID = process.env.GITHUB_CLIENT_ID;
const clientSecret = process.env.GITHUB_CLIENT_SECRET;
const callbackURL = process.env.GITHUB_CALLBACK_URL;

passport.use(
  "github",
  new GitHubStrategy(
    {
      clientID,
      clientSecret,
      callbackURL,
    },
    async (accessToken, refreshToken, profile, done) => {
      //Datos del perfil
      try {
        let userGith = await UserModel.findOne({
          email: profile._json.email,
        });

        if (!userGith) {
          let newUser = {
            first_name: profile._json.name,
            last_name: "",
            age: 40,
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
module.exports = { initializePassport };

// //Estrategia para registro
// passport.use(
//   "register",
//   new LocalStrategy(
//     {
//       //Acceso al objeto request
//       passReqToCallback: true,
//       usernameField: "email",
//     },
//     async (req, username, password, done) => {
//       const { first_name, last_name, email, age } = req.body;

//       try {
//         //Validación para chequear si existe un registro con ese mail
//         let user = await UserModel.findOne({ email });

//         if (user) {
//           return done(null, false);
//         }

//         //Si no existe, creo un registro de usuario nuevo, al cual se asociará un nuevo carrito
//         let newCart = await CartModel.create({ products: [] });

//         let newUser = {
//           first_name,
//           last_name,
//           email,
//           age,
//           password: createHash(password),
//           //Al nuevo usuario, vinculo el id del carrito nuevo
//           cart: newCart._id,
//         };

//         let result = await UserModel.create(newUser);
//         return done(null, result);
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );

// //Estrategia para login
// passport.use(
//   "login",
//   new LocalStrategy(
//     {
//       usernameField: "email",
//     },
//     async (email, password, done) => {
//       try {
//         //Validación para chequear si existe un usuario con ese mail
//         let user = await UserModel.findOne({ email });

//         if (!user) {
//           console.log("El usuario ingresado no existe");
//           return done(null, false);
//         }

//         //Si existe el usuario, valido el password
//         if (!isValidPassword(password, user)) {
//           return done(null, false);
//         }

//         return done(null, user);
//       } catch (error) {
//         return done(error);
//       }
//     }
//   )
// );

// //Serializo y Deserializo
// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
//   let userDes = await UserModel.findById(id).populate("cart");
//   done(null, userDes);
// });
