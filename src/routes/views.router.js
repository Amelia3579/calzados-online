// // Actividades desafío4 (Websockets)
const express = require("express");
const router = express.Router();
const ProductManager = require("../controllers/productManager.js");
const CartManager = require("../controllers/cartManagerDb.js");
const ProductModel = require("../models/product.model.js");
const CartModel = require("../models/cart.model.js");
const UserModel = require("../models/user.model.js");
const { isValidPassword } = require("../utils/hashbcrypt.js");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const productTest = new ProductManager("./src/models/array-product.json");
const cartTest = new CartManager();

//Middleware de autenticación con JWT
const authenticateJWT = passport.authenticate("jwt", { session: false });

//Ruta para Vista de home.handlebars
// router.get("/", async (req, res) => {
//   try {
//     const { status, products } = await productTest.readJson();

//     if (status && products) {
//       return res.status(200).render("home", { products });
//     } else {
//       res.status(404).render("no_products_found");
//     }
//   } catch (error) {
//     res.status(500).send(error.message);
//   }
// });

//Ruta para Vista de realtimeproducts.handlebars
router.get("/realtimeproducts", (req, res) => {
  res.render("realtimeproducts");
});

//Actividad desafío complementario (MongoDB)
//Ruta para la Vista de chat.handlebars
// router.get("/", (req, res) => {
//   res.render("chat");
// });

//Actividades 2° pre-entrega
//Ruta para mostrar productos y paginación
router.get("/products", authenticateJWT, async (req, res) => {
  try {
    const limit = req.query.limit || 1;
    const page = req.query.page || 5;

    const availableProd = await ProductModel.paginate({}, { limit, page });

    if (!availableProd) {
      return res.json({
        error:
          "La paginación no se pudo efectuar. Verifique los datos ingresados",
        error,
      });
    } else {
      //Recibo los docs y los mapeo para que me brinde la información (en reemplazo del método .lean())
      availableProd.docs = availableProd.docs.map((doc) =>
        doc.toObject({ getters: false })
      );
    }

    //Guardo la información del usuario
    const user = req.user;

    res.render("home", {
      products: availableProd.docs,
      totalDocs: availableProd.totalDocs,
      limit: availableProd.limit,
      totalPages: availableProd.totalPages,
      page: availableProd.page,
      pagingCounter: availableProd.pagingCounter,
      currentPage: availableProd.page,
      hasPrevPage: availableProd.hasPrevPage,
      hasNextPage: availableProd.hasNextPage,
      prevPage: availableProd.prevPage,
      nextPage: availableProd.nextPagePage,
      user: user,
    });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Ruta para enviar productos agregados al carrito, según ID especificado
// router.post("/carts/:cid", async (req, res) => {
//   try {
//     const cartId = req.params.cid;
//     const prodId = req.body.productId;
//     const quantity = req.body.quantity;

//     const cart = await CartModel.findById(cartId, prodId, quantity);

//     if (!cart) {
//       return res.json({
//         error: `Error al agregar los productos al carrito con el ID: ${cartId}`,
//         error,
//       });
//     } else {
//       res.json(cart);
//     }
//   } catch (error) {
//     return res.status(500).send({ message: error.message });
//   }
// });

//Ruta para mostrar productos agregados al carrito, según ID especificado
router.get("/carts/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;

    const cart = await CartModel.findById(cartId).lean();

    if (!cart) {
      return res.json({
        error: `Error al mostrar el carrito con el ID: ${cartId}`,
        error,
      });
    } else {
      const products = await Promise.all(
        cart.products.map(async (elem) => {
          const product = await ProductModel.findById(elem.product).lean();
          return { ...elem, product };
        })
      );
      res.render("cart", { products });
    }
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
});

//Ruta para que cuando cargue la app, Login sea lo 1° que aparezca
router.get("/", (req, res) => {
  return res.redirect("/login");
});

//Ruta para Login
router.get("/login", (req, res) => {
  //Validación para chequear si el usuario está logueado, si es así, redirije a la ruta de products
  if (req.user) {
    return res.redirect("/products");
  }
  res.render("login");
});

//Ruta para Register
router.get("/register", (req, res) => {
  //Validación para chequear si el usuario está logueado, si es asi, redirijo al perfil
  if (req.user) {
    return res.redirect("/profile");
  }
  res.render("register");
});

//Ruta para Profile(protegida por jwt)- Ruta Current
// router.get(
//   "/profile",
//   passport.authenticate("jwt", { session: false }),
//   async (req, res) => {
//     console.log("Middleware de Passport JWT ejecutándose...");
//     try {
//       // Verifico si el usuario está autenticado
//       if (!req.user) {
//         // Si no está autenticado, redirijo a Login
//         return res.redirect("/login");
//       }
//       //Guardo la información del usuario
//       const user = await UserModel.findById(req.user._id).lean();

//       res.render("profile", { user });
//     } catch (error) {
//       return res.status(500).send({ message: error.message });
//     }
//   }
// );

module.exports = router;
