//Importo File System
const fs = require("fs");

//Creo clase con su constructor
class CartManager {
  //Variable para generar id autoincrementable
  static id = 0;

  constructor(path) {
    this.carts = [];
    this.path = path;
    this.initCarts();
  }

  //Método para crear el json
  async initCarts() {
    try {
      const file = fs.existsSync(this.path);
      if (!file) {
        await fs.promises.writeFile(
          this.path,
          JSON.stringify([{ id: ++CartManager.id, products: [] }])
        );
        this.carts = [];
      } else {
        this.carts = await this.readJson();
        const lastProduct = this.carts[this.carts.length - 1];
        CartManager.id = lastProduct ? lastProduct.id : 0;
      }
    } catch (error) {
      console.log("Error al inicializar el carrito: " + error);
    }
  }

  //Creación/guardado del archivo con promesa
  async createJson() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.carts, null, 2)
      );
    } catch (error) {
      throw new Error(`Error al crear el archivo: ${error.messaje}`);
    }
  }

  //Lectura del archivo con promesa
  async readJson() {
    try {
      const file = fs.existsSync(this.path);
      if (!file) {
        return [];
      }
      const fileContent = await fs.promises.readFile(this.path, "utf-8");
      if (!fileContent) {
        return [];
      }
      return JSON.parse(fileContent);
    } catch (error) {
      return {
        message: `Error al agregar el carrito: ${error.messaje}`,
      };
    }
  }

  //Método para generar carrito nuevo
  async createCart() {
    try {
      const newCart = {
        id: ++CartManager.id,
        products: [],
      };
      this.carts.push(newCart);

      await this.createJson();
      return newCart;
    } catch (error) {
      throw new Error(`Error al agregar el carrito: ${error.message}`);
    }
  }

  //Método para listar productos del carrito según el ID especificado
  async getCartById(cartId) {
    try {
      const cart2 = await this.carts.find((el) => el.id === cartId);

      if (cart2) {
        return cart2;
      } else {
        return {
          status: false,
          message: `Error al buscar el carrito: ${error.messaje}`,
        };
      }
    } catch (error) {
      throw error;
    }
  }

  //Método para agregar productos al carrito, según el ID especificado de ambos items
  async addProdCart(cartId, prodId, quantity = 1) {
    try {
      const cart = await this.getCartById(cartId);
      const existProduct = cart.products.find((el) => el.product === prodId);

      if (existProduct) {
        existProduct.quantity += quantity;
      } else {
        cart.products.push({ product: prodId, quantity });
      }
      await this.createJson();
      return {
        status: true,
        message: "El producto fue agregado",
      };
    } catch (error) {
      return {
        status: false,
        message: `Error al agregar el producto: ${error.messaje}`,
      };
    }
  }
}

//Exporto la clase para que sea utilizada por app.js
module.exports = CartManager;
