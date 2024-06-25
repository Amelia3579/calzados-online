const { productRepository, userRepository } = require("../services/index.js");
const mongoose = require("mongoose");
const { generateProducts } = require("../utils/faker.js");

class ProductManager {
  //Método para agregar producto
  async addProduct(req, res) {
    try {
      //Capturo datos que vienen del body
      const addProductBody = req.body;

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
      } = addProductBody;

      //Validación para que el producto quede ingresado una vez completos todos los campos
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
        return res.status(422).send({
          message:
            "Para que el producto quede agregado, todos los campos tienen que estar completos",
        });
      }

      //Validación para buscar código de producto
      const searchedProduct = await productRepository.findOne({ code: code });

      if (searchedProduct) {
        return res.status(409).send({
          message: `El código ${code} del producto ya está ingresado.`,
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

      return res.status(200).json({
        success: true,
        message: `El producto fue agregado exitosamente.`,
        product: JSON.parse(JSON.stringify(newProduct, null, 2)),
      });
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para mostrar producto según limit, page, query y sort especificados
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
      const user = req.user;
      const cartId = user.cart;

      res.render("home", {
        products: availableProd.docs,
        cartId,
        user: user,
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

  //Método para mostrar producto por id
  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const searchedId = await productRepository.findById(productId);

      if (!searchedId) {
        return res.status(404).send({
          success: false,
          message: `El producto con el ID: ${productId} no fue encontrado. Verificar el identificador ingresado.`,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: `El producto con el ID ${productId} fue encontrado.`,
          product: JSON.parse(JSON.stringify(searchedId, null, 2)),
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para actualizar el producto según el ID especificado
  async updateProduct(req, res) {
    try {
      const productId = req.params.id;
      const putProductBody = req.body;

      // Validación para verificar si existe  el producto con el ID especificado
      const updatedProduct = await productRepository.findByIdAndUpdate(
        productId,
        putProductBody
      );

      if (!updatedProduct) {
        return res.status(404).send({
          success: false,
          message: `El producto con el ID: ${productId} no fue encontrado. Verificar el identificador ingresado.`,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: `El producto con el ID ${productId} fue actualizado correctamente.`,
          product: JSON.parse(JSON.stringify(updatedProduct, null, 2)),
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para eliminar producto según ID especificado
  async deleteProduct(req, res) {
    try {
      const productId = req.params.id;

      // Validación para verificar si existe  el producto con el ID especificado
      const deletedProduct = await productRepository.findByIdAndDelete(
        productId
      );

      if (!deletedProduct) {
        return res.status(404).send({
          success: false,
          message: `El producto con el ID: ${productId} no fue encontrado. Verificar el identificador ingresado.`,
        });
      } else {
        return res.status(200).json({
          success: true,
          message: `El producto con el ID ${productId} fue eliminado.`,
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //------Lógica para realtimeproduct.handlebars y Websocket------

  //Función para realtimeproduct.handlebars
  getRealTimeProducts(req, res) {
    try {
      return res.render("realtimeproducts");
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Método para agregar productos usando Socket
  async addProductSocket(product, user) {
    try {
      if (user.role === "Admin") {
        const addedProduct = await productRepository.create(product);

        console.log("El producto fue agregado exitosamente.");
        return { success: true, addedProduct };
      } else {
        console.log("Error al intentar agregar el producto");
        return {
          success: false,
          error:
            "El producto no se puede agregar. No cuenta con los permisos necesarios.",
        };
      }
    } catch (error) {
      console.log("Error al agregar el producto:", error);
      return { success: false, error: error.message };
    }
  }

  //Método para mostrar productos usando Socket
  async getProductsSocket() {
    try {
      const searchedProduct = await productRepository.find();

      if (!searchedProduct) {
        console.log("Error al intentar mostrar los productos");
        return { success: false, error: "Los productos no se pueden mostrar" };
      } else {
        console.log("Los productos disponibles son: ", searchedProduct);
        return searchedProduct;
      }
    } catch (error) {
      console.log("Error al mostrar los productos", error.message);
      return [];
    }
  }

  //Método para eliminar productos usando Socket
  async deleteProductSocket(id, user) {
    try {
      // const deletedProduct = await productRepository.findByIdAndDelete(id);

      if (user.role === "Admin") {
        const deletedProduct = await productRepository.findByIdAndDelete(id);
        console.log("El producto fue eliminado exitosamente.");
        return { success: true, deletedProduct };
      } else {
        console.log("Error al intentar eliminar el producto.");
        return { success: false, error: "El producto no existe" };
      }
    } catch (error) {
      console.log("Error al eliminar el producto", error.message);
      return { success: false, error: error.message };
    }
  }

  //------Lógica para Focker------
  async generateProductsFocker() {
    try {
      const products = [];
      for (let i = 0; i < 100; i++) {
        products.push(generateProducts());
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }
}
module.exports = ProductManager;
