const ProductModel = require("../models/product.model.js");
const mongoose = require("mongoose");

class ProductRepository {
  //Método para agregar productos
  async addProduct(dataProduct) {
    try {
      const newProductR = new ProductModel(dataProduct);

      return await newProductR.save();
    } catch (error) {
      //Lanzo el objeto error hacia el controlador, ya no gestiono las respuestas
      throw new Error("Error al crear el producto");
    }
  }
  //Método para validar el código de un producto
  async findOne(query) {
    try {
      return await ProductModel.findOne(query);
    } catch (error) {
      throw new Error("Error al buscar el producto");
    }
  }
  //Método para mostrar la paginación
  async getPaginate(query, options) {
    try {
      return await ProductModel.paginate(query, options);
    } catch (error) {
      throw new Error("Error al efectuar la paginación");
    }
  }

  //Método para mostrar producto por id
  async findById(productId) {
    try {
      return await ProductModel.findById(productId);
    } catch (error) {
      throw new Error("Error al mostrar el producto");
    }
  }

  //Método para actualizar el producto según el ID especificado
  async findByIdAndUpdate(productId, putProductBody) {
    try {
      return await ProductModel.findByIdAndUpdate(productId, putProductBody);
    } catch (error) {
      throw new Error("Error al actualizar el producto");
    }
  }

  //Método para eliminar producto según ID especificado
  async findByIdAndDelete(productId, putProductBody) {
    try {
      return await ProductModel.findByIdAndDelete(productId, putProductBody);
    } catch (error) {
      throw new Error("Error al eliminar el producto");
    }
  }
}

module.exports = ProductRepository;
