//Importo File System
const fs = require("fs");

//Creo clase con su constructor que recibe los parámetros solicitados
class ProductManager {
  //Variable para generar id autoincrementable
  static id = 0;

  constructor(path, products = []) {
    this.path = path;
    this.products = products;
    this.init();
  }

  //Método para verificar la existencia del archivo e imprimir el id
  async init() {
    try {
      const file = fs.existsSync(this.path);
      if (file) {
        this.products = await this.readJson();

        const lastProduct = this.products[this.products.length - 1];
        ProductManager.id = lastProduct ? lastProduct.id : 0;
      } else {
        await fs.promises.writeFile(this.path, "[]");
        this.products = [];
      }
    } catch (error) {
      console.log(error);
    }
  }

  //Creo método para ingresar productos al array vacío
  async addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;

    //Validación para buscar código de producto
    if (this.products.some((el) => el.code == code)) {
      console.log(
        `El código ${code} del producto ${title} ya está ingresado. Intenta con otro código.`
      );
      return;
    }

    //Validación para que el producto quede ingresado una vez completos todos los campos
    if (
      title === "" ||
      description === "" ||
      price === 0 ||
      thumbnail === "" ||
      code === 0 ||
      stock === 0
    ) {
      console.log(
        "Para que el producto quede agregado, todos los campos tienen que estar completos"
      );
      return;
    }

    //Se agrega producto al array, con sus propiedades y id autoincrementable
        
      else {
        const newProduct = this.products.push({
          ...product,
          id: ++ProductManager.id,
        });
        console.log(newProduct);
      }
      await this.createJson();
    }

  //Creación/guardado del archivo con promesa
  async createJson() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      console.log(error);
      throw error;
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
      console.log(error);
      throw error;
    }
  }
  //Método para mostrar el array de productos
  async getProducts() {
    try {
      return (
        "Los productos ingresados son: " +
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //Método para buscar producto por id
  async getProductById(id) {
    try {
      const buscarId = await this.products.find((el) => el.id == id);

      if (buscarId) {
        console.log(`El producto encontrado es : `, buscarId);
        return;
      } else {
        console.log(
          `El id ingresado no se corresponde con ningún producto. Podés seguir buscando.`
        );
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //Método para reemplazar al producto que coincida con el id ingresado
  async updateProduct(id, updateProduct) {
    try {
      const index = this.products.findIndex((product) => product.id === id);

      if (index !== -1) {
        this.products[index] = { ...updateProduct, id: id };
        await this.createJson();
        console.log("El producto con el id: " + id + " fue actualizado");
      } else {
        console.log("El producto con el id: " + id + " no fue encontrado");
      }
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //Método para eliminar al producto que coincida con el id ingresado
  async deleteProduct(id) {
    try {
      const result = this.products.filter((product) => product.id !== id);

      await fs.promises.writeFile(this.path, JSON.stringify(result, null, 2));
      console.log("El producto con el id: " + id + " fue eliminado");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

async function array() {
  //Instancia para mostrar array vacío
  const test = new ProductManager("./array-product.json");
  await test.init();

  //Instancias para agregar productos
  const productTest = new ProductManager("./array-product.json");

  await productTest.addProduct({
    title: "Producto Prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin Imagen",
    code: "abc123",
    stock: 25,
  });

  await productTest.addProduct({
    title: "Oreja de Srhek",
    description: "Suculenta",
    price: 2500,
    thumbnail: "Sin Imagen",
    code: "abc1234",
    stock: 25,
  });

  await productTest.addProduct({
    title: "Cola de Burro",
    description: "Suculenta Colgante",
    price: 3000,
    thumbnail: "Sin Imagen",
    code: "abc1235",
    stock: 25,
  });

  //Producto para validar code repetido
  await productTest.addProduct({
    title: "Arbol de Jade",
    description: "Suculenta",
    price: 2000,
    thumbnail: "Sin Imagen",
    code: "abc123",
    stock: 25,
  });

  //Producto para validar campo incompleto
  await productTest.addProduct({
    title: "",
    description: "Suculenta Colgante",
    price: 3000,
    thumbnail: "Sin Imagen",
    code: "abc1236",
    stock: 25,
  });

  //Invoco instancia para mostrar productos agregados
  const arrayProducts = await productTest.getProducts();
  console.log(arrayProducts);

  //Invoco instancias para hacer búsqueda de producto por id
  productTest.getProductById(8);
  productTest.getProductById(2);

  //Invoco instancia para reemplazar producto
  await productTest.updateProduct(3, {
    title: "Aloe Vera",
    description: "Suculenta",
    price: 2500,
    thumbnail: "Sin Imagen",
    code: "abc1237",
    stock: 25,
  });

  //Invoco instancia para eliminar producto
  productTest.deleteProduct(1);
}
array();
