const ProductModel = require("../models/product.model.js");
const mongoose = require("mongoose");

class ProductRepository {
  //Método para agregar productos
  async addProduct(dataProduct) {
    try {
      const newProductR = new ProductModel(dataProduct);

      return await newProductR.save();
    } catch (error) {
      console.error(`Error al agregar el producto: ${error.message}`);
      throw new Error("Error al agregar el producto");
    }
  }
  //Método para validar el código de un producto
  async findOne(query) {
    try {
      return await ProductModel.findOne(query);
    } catch (error) {
      console.error(`Error al buscar el producto: ${error.message}`);
      throw new Error("Error al buscar el producto");
    }
  }
  //Método para mostrar la paginación
  async getPaginate(query, options) {
    try {
      return await ProductModel.paginate(query, options);
    } catch (error) {
      console.error(`Error al efectuar la paginación: ${error.message}`);
      throw new Error("Error al efectuar la paginación");
    }
  }

  //Método para mostrar producto por id
  async findById(productId) {
    try {
      return await ProductModel.findById(productId);
    } catch (error) {
      console.error(`Error al mostrar el producto: ${error.message}`);
      throw new Error("Error al mostrar el producto");
    }
  }

  //Método para actualizar el producto según el ID especificado
  async findByIdAndUpdate(productId, putProductBody) {
    try {
      return await ProductModel.findByIdAndUpdate(productId, putProductBody);
    } catch (error) {
      console.error(`Error al actualizar el producto: ${error.message}`);
      throw new Error("Error al actualizar el producto");
    }
  }

  //Método para eliminar producto según ID especificado
  async findByIdAndDelete(productId, putProductBody) {
    try {
      return await ProductModel.findByIdAndDelete(productId, putProductBody);
    } catch (error) {
      console.error(`Error al eliminar el producto: ${error.message}`);
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }

  //Lógica para realtimeproduct.handlebars y Websocket

  //Método para mostrar productos usando Socket
  async find() {
    try {
      return await ProductModel.find().lean();
    } catch (error) {
      console.error(`Error al mostrar los productos: ${error.message}`);
      throw new Error("Error al intentar mostrar los productos: ");
    }
  }

  //Método para agregar productos usando Socket
  async create(product) {
    try {
      return await ProductModel.create(product);
    } catch (error) {
      console.error(`Error al agregar el producto: ${error.message}`);
      throw new Error("Error al intentar agregar el producto: ");
    }
  }

  //Método para eliminar productos usando Socket
  async findByIdAndDelete(id) {
    try {
      return await ProductModel.findByIdAndDelete(id);
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
      console.error(`Error al mostrar los productos: ${error.message}`);
      throw new Error("Error al mostrar los productos.");
    }
  }
}

module.exports = ProductRepository;
