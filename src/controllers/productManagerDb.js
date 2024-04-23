const mongoose = require("mongoose");
const ProductModel = require("../models/product.model.js");

class ProductManager {
  async addProduct(product) {
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
      } = product;

      //Validación para que el producto quede ingresado una vez completos todos los campos
      if (
        title === "" ||
        description === "" ||
        price === 0 ||
        thumbnail === "" ||
        code === 0 ||
        stock === 0 ||
        img === "" ||
        category === "" ||
        status === ""
      ) {
        throw new Error(
          "Para que el producto quede agregado, todos los campos tienen que estar completos"
        );
      }

      //Validación para buscar código de producto
      const existProduct = await ProductModel.findOne({ code: code });

      if (existProduct) {
        throw new Error(`El código ${code} del producto ya está ingresado.`);
      }

      const newProduct = new ProductModel({
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

      await newProduct.save();
      console.log("Producto agregado correctamente: ", newProduct);
    } catch (error) {
      throw new Error(`Error al agregar el producto: ${error.message}`);
    }
  }

  //Método para mostrar los productos
  async getProducts() {
    try {
      const products = await ProductModel.find();
      return products;
    } catch (error) {
      throw new Error(`Error al mostrar los productos: ${error.message}`);
    }
  }

  //Método para buscar producto por id
  async getProductById(id) {
    try {
      const searchId = await ProductModel.findById(id);

      if (!searchId) {
        console.log(`El producto con el ID: ${id} no fue encontrado.`);
        return null;
      } else {
        console.log(`El producto con el ID: ${id} fue encontrado.`);
        return searchId;
      }
    } catch (error) {
      throw new Error(`Error al buscar el producto: ${error.message}`);
    }
  }

  //Método para actualizar el producto según el ID especificado
  async updateProduct(id, updatedProduct) {
    try {
      const updateProd = await ProductModel.findByIdAndUpdate(
        id,
        updatedProduct
      );

      if (!updateProd) {
        console.log(`El producto con el ID: ${id} no fue encontrado.`);
        return null;
      } else {
        console.log(`El producto con el ID: ${id} fue actualizado.`);
        return updateProd;
      }
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  //Método para verificar si existe el producto con el ID especificado
  async productExists(id) {
    try {
      const searchId = await ProductModel.findById(id);

      if (searchId) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      throw new Error(`Error al buscar el producto: ${error.message}`);
    }
  }

  //Método para eliminar al producto según el ID especificado
  async deleteProduct(id) {
    try {
      const deleteProd = await ProductModel.findByIdAndDelete(id);

      if (!deleteProd) {
        console.log(`El producto con el ID: ${id} no fue encontrado.`);
        return null;
      } else {
        console.log(`El producto con el ID: ${id} fue eliminado`);
        return deleteProd;
      }
    } catch (error) {
      throw new Error(`Error al buscar el producto: ${error.message}`);
    }
  }
}

module.exports = ProductManager;
