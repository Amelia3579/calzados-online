const { productRepository, userRepository } = require("../services/index.js");
const mongoose = require("mongoose");
const { generateProducts } = require("../utils/faker.js");
const CustomError = require("../services/errors/custom-error.js");
const infoError = require("../services/errors/info.js");
const { dictionaryError } = require("../services/errors/enum.js");

class ProductController {
  //Método para agregar producto
  async addProduct(req, res = null) {
    try {
      //Capturo datos que vienen del body
      const addProductBody = req.body || req;

      const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        category,
        status,
      } = addProductBody;

      //Validación para que el producto quede ingresado una vez completados todos los campos
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !category ||
        status === undefined
      ) {
        return res.status(422).send({
          message:
            "In order for the product to be added, all its fields must be completed.",
        });
      }

      //Validación para buscar código de producto
      const product = await productRepository.findOne({ code: code });

      if (product) {
        return res.status(409).send({
          message: `The code ${code} already exists.`,
        });
      }

      const newProduct = await productRepository.addProduct({
        title,
        description,
        price,
        thumbnail: thumbnail || [],
        code,
        stock,
        img,
        category,
        status: true,
      });

      if (res) {
        return res.status(201).send({
          status: "success",
          message: "The product was successfully added.",
          payload: newProduct,
        });
      } else {
        return newProduct;
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para obtener productos según limit, page, query y sort especificados
  async getProducts(req, res) {
    try {
      const limit = req.query.limit || 10;
      const page = req.query.page || 1;
      const query = req.query.category;
      const sort =
        req.query.sort === "1" ? 1 : req.query.sort === "-1" ? -1 : 0;

      //Defino opciones para sort
      const sortOption = {};
      if (sort !== 0) {
        sortOption.price = sort;
      }

      const options = {
        limit,
        page,
        sort: sortOption,
      };

      let availableProd;
      //Validación para recibir query
      if (query) {
        availableProd = await productRepository.getPaginate(query, options);
        //Si no recibo query, brindo la paginación teniendo en cuenta todas las categorías
      } else {
        availableProd = await productRepository.getPaginate({}, { options });
      }

      //Recibo los docs y los mapeo para que me brinde la información (en reemplazo del método .lean())
      availableProd.docs = availableProd.docs.map((doc) =>
        doc.toObject({ getters: false })
      );

      //Guardo la información del usuario y del carrito
      const user = req.user || {};
      const cartId = user.cart || null;

      res.render("products", {
        products: availableProd.docs,
        user: user,
        cartId,
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
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para obtener producto según ID especificado
  async getProductById(req, res) {
    try {
      const prodId = req.params.pid;
      const product = await productRepository.findById(prodId);

      if (!product) {
        return res.status(404).send({
          success: false,
          message: `The product with the ID ${prodId} was not found.`,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: `The product with the ID ${prodId} was found.`,
          product: JSON.parse(JSON.stringify(product, null, 2)),
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //------Lógica para handleError------

  //Método para actualizar el producto según el ID especificado
  async updateProduct(req, res, next) {
    try {
      const prodId = req.params.pid;
      const putProductBody = req.body;

      const {
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
        img,
        category,
        status,
      } = putProductBody;

      // Validación para verificar si existe  el producto con el ID especificado
      const existProduct = await productRepository.findById(prodId);

      if (!existProduct) {
        return res.status(404).send({
          success: false,
          message: `The product with the ID: ${prodId} was not found.`,
        });
      }
      req.logger.warning(
        "In order for the product to be updated, all its fields must be completed."
      );
      //Si el producto fue encontrado. Valido para modificarlo una vez completados todos los campos
      if (
        !title ||
        !description ||
        !price ||
        !thumbnail ||
        !code ||
        !stock ||
        !img ||
        !category ||
        status === undefined
      ) {
        throw CustomError.createError({
          name: "Product not updated",
          cause: infoError(putProductBody),
          message: "Error trying to update the product",
          code: dictionaryError.INVALID_TYPES_ERROR,
        });
      }

      // Actualizo el producto
      const updatedProduct = await productRepository.findByIdAndUpdate(
        prodId,
        putProductBody
      );

      return res.status(200).json({
        success: true,
        message: `The product with the ID ${prodId} was successfully updated.`,
        payload: JSON.parse(JSON.stringify(updatedProduct, null, 2)),
      });
    } catch (error) {
      next(error);
    }
  }

  //Método para eliminar producto según ID especificado
  async deleteProduct(req, res) {
    try {
      const prodId = req.params.pid;

      // Validación para verificar si existe  el producto con el ID especificado
      const product = await productRepository.findByIdAndDelete(prodId);

      if (!product) {
        return res.status(404).send({
          success: false,
          message: `The product with the ID: ${prodId} was not found.`,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: "The product was successfully deleted",
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para subir imágenes de los productos
  async uploadImages(req, res) {
    try {
      const prodId = req.params.pid;
      const image = req.file;

      if (!image) {
        return res.status(400).send("No image file uploaded.");
      }

      const product = await productRepository.findOne({ _id: prodId });
      if (!product) {
        return res.status(404).send("Product not found.");
      }

      product.img = `/img/${image.filename}`;
      await product.save();

      res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: product.img,
      });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  }

  //------Lógica para Faker------
  async getProductsFaker(req, res) {
    try {
      let products = [];
      for (let i = 0; i < 100; i++) {
        products.push(generateProducts());
      }

      return res.status(200).send({
        success: true,
        message: "The products Facker was successfully updated",
        products: products,
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}
module.exports = ProductController;
