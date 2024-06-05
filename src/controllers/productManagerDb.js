// const ProductModel = require("../models/product.model.js");
const productRepository = require("../services/index.js");
const mongoose = require("mongoose");

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
        return res.send({
          message:
            "Para que el producto quede agregado, todos los campos tienen que estar completos",
        });
      }

      //Validación para buscar código de producto
      const existProduct = await productRepository.findOne({ code: code });

      if (existProduct) {
        return res.send({
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

      return res.json({
        message: `Producto agregado correctamente: ${newProduct}`,
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
  }

  //Método para mostrar producto por id
  async getProductById(req, res) {
    try {
      const productId = req.params.id;
      const searchId = await productRepository.findById(productId);

      if (!searchId) {
        return res.send({
          message: `Producto con el ${productId} no fue encontrado.`,
        });
      } else {
        return res.json({
          message: `El producto fue encontrado: ${searchId}`,
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
      const productExists = await productRepository.findByIdAndUpdate(
        productId,
        putProductBody
      );

      if (!productExists) {
        return res.send({
          message: `El producto con el ID ${productId} no fue encontrado. Verificar el identificador ingresado.`,
        });
      } else {
        return res.json({
          message: `El producto con el ID: ${productId} fue actualizado correctamente.`,
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
      const putProductBody = req.body;

      // Validación para verificar si existe  el producto con el ID especificado
      const productExists = await productRepository.findByIdAndDelete(
        productId,
        putProductBody
      );

      if (!productExists) {
        return res.send({
          message: `El producto con el ID: ${productId} no fue encontrado. Verificar el identificador ingresado.`,
        });
      } else {
        return res.json({
          message: `El producto con el ID: ${productId} fue eliminado.`,
        });
      }
    } catch (error) {
      return res.status(500).send({ message: error.message });
    }
  }

  //Lógica para realtimeproduct.handlebars y Websocket
  
  //Función para realtimeproduct.handlebars
  getRealTimeProducts(req, res) {
    try {
      return res.render("realtimeproducts");
    } catch (error) {
      return console.log(
        "Error al mostrar el formulario para agregar productos"
      );
    }
  }

  //Método para mostrar productos usando Socket
  async getAllProducts() {
    try {
      const products = await ProductModel.find().lean();
      return products;
    } catch (error) {
      console.log("Error al obtener productos", error);
      return [];
    }
  }

  //Método para agregar productos usando Socket
  async addP(product) {
    try {
      await ProductModel.create(product);
    } catch (error) {
      console.log("Error al agregar producto", error);
    }
  }

  //Método para eliminar productos usando Socket
  async deleteP(id) {
    try {
      await ProductModel.findByIdAndDelete(id);
    } catch (error) {
      console.log("Error al eliminar producto", error);
    }
  }
}

/////////////////////////////////////////////

module.exports = ProductManager;
