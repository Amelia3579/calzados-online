const ProductModel = require("../models/product.model.js");
const mongoose = require("mongoose");
const CustomError = require("../services/errors/custom-error.js");
const infoError = require("../services/errors/info.js");
const { dictionaryError } = require("../services/errors/enum.js");

class ProductRepository {
  //Método para agregar productos
  async addProduct(dataProduct) {
    try {
      const newProductR = new ProductModel(dataProduct);

      return await newProductR.save();
    } catch (error) {
      console.error(`Error adding product: ${error.message}`);
      throw new Error("Error adding product");
    }
  }
  //Método para validar el código de un producto
  async findOne(query) {
    try {
      return await ProductModel.findOne(query);
    } catch (error) {
      console.error(`Error searching product: ${error.message}`);
      throw new Error("Error searching product");
    }
  }
  //Método para mostrar la paginación
  async getPaginate(query, options) {
    try {
      return await ProductModel.paginate(query, options);
    } catch (error) {
      console.error(`Error performing pagination: ${error.message}`);
      throw new Error("Error performing pagination");
    }
  }

  //Método para mostrar producto por id
  async findById(productId) {
    try {
      return await ProductModel.findById(productId);
    } catch (error) {
      console.error(`Error displaying product: ${error.message}`);
      throw new Error("Error displaying product");
    }
  }

  //Método para actualizar el producto según el ID especificado
  async findByIdAndUpdate(productId, putProductBody) {
    try {
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

      const updatedProduct = await ProductModel.findByIdAndUpdate(
        productId,
        putProductBody,
        { new: true }
      );

      return updatedProduct;
    } catch (error) {
      throw CustomError.createError({
        name: "Update error",
        cause: infoError(putProductBody),
        message: "Error updating product",
        code: dictionaryError.INVALID_TYPES_ERROR,
      });
    }
  }

  //Método para eliminar producto según ID especificado
  async findByIdAndDelete(productId, putProductBody) {
    try {
      return await ProductModel.findByIdAndDelete(productId, putProductBody);
    } catch (error) {
      console.error(`Error deleting product: ${error.message}`);
      throw new Error(`Error deleting product: ${error.message}`);
    }
  }

  //------Lógica para realtimeproducts.handlebars con Websocket------

  //Método para mostrar productos
  async find() {
    try {
      return await ProductModel.find().lean();
    } catch (error) {
      console.error(`Error al mostrar los productos: ${error.message}`);
      throw new Error("Error al intentar mostrar los productos: ");
    }
  }

  //Método para agregar productos
  async addProduct(product) {
    try {
      const newProduct = new ProductModel(product);
      return await newProduct.save();
    } catch (error) {
      console.error(`Error al agregar el producto: ${error.message}`);
      throw new Error("Error al intentar agregar el producto: ");
    }
  }

  //Método para eliminar productos
  async findByIdAndDelete(_id) {
    try {
      return await ProductModel.findByIdAndDelete(_id);
    } catch (error) {
      console.error(`Error al eliminar el producto: ${error.message}`);
      throw new Error("Error al intentar eliminar el producto: ");
    }
  }

  //Método para listar productos del carrito según el ID especificado, con renderizado de cart.handlebars
  async findById(product) {
    try {
      return await ProductModel.findById(product).lean();
    } catch (error) {
      console.error(`Error displaying products: ${error.message}`);
      throw new Error("Error displaying products.");
    }
  }
}

module.exports = ProductRepository;
