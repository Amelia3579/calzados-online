const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/product.controller.js");
const productTest = new ProductController();
const passport = require("passport");
//Middleware de autenticación con JWT
const authenticateJWT = passport.authenticate("jwt", { session: false });
const upload = require("../middleware/multer.js");

//Estructuración por capas
router.get("/mockingproducts", productTest.getProductsFaker);
router.get("/", productTest.getProducts);
router.get("/:pid", productTest.getProductById);
router.post("/addproducts", authenticateJWT, productTest.addProduct);
//------Ruta para la carga de imágenes)------
router.post(
  "/:pid/uploadimage",
  upload.single("image"),
  productTest.uploadImages
);

router.put("/:pid", productTest.updateProduct);
router.delete("/:pid", productTest.deleteProduct);

module.exports = router;
