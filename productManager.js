//Importo File System
const fs = require("fs");

//Creo clase con su constructor que recibe los parámetros solicitados
class ProductManager {
  //Variable para generar id autoincrementable
  static id = 0;

  constructor() {
    this.path = "./array-product.json";
    this.products = [];
  }

  
  //Creo método para ingresar productos al array vacío
  async addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;
    
    //Validación para buscar código de producto
    if (this.products.some((el) => el.code === code)) {
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
      const productsNew = this.products.push({
        ...product,
        id: ++ProductManager.id,
      });
      console.log(productsNew);
    }
    await this.crearJson();
  }

  //Método para mostrar array vacío
  async getProductsVacío() {
    return this.products;
  }

  //Creación/guardado del archivo con promesa
  async crearJson() {
    try {
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      console.log(mensaje.error);
      throw error;
    }
  }

  //Lectura del archivo con promesa
  async leerJson() {
    try {
      const respuesta1 = await fs.promises.readFile(this.path, "utf-8");
      const respuesta2 = JSON.parse(respuesta1);
      return respuesta2;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //Método para mostrar el array de productos
  async getProducts() {
    try {
      const resultado = await this.leerJson();
      return (
        "Los productos ingresados son: " + JSON.stringify(resultado, null, 2)
      );
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //Método para buscar id de producto
  async getProductById(id) {
    try {
      const resultado = await this.leerJson();
      const buscarId = resultado.find((el) => el.id === id);

      if (buscarId) {
        console.log(
          `Búsqueda por id\nEl id: ${id} pertenece al producto: `,
          buscarId
        );
      } else {
        console.log(
          `Búsqueda por id\nEl id: ${id} no fue encontrado. Puede seguir buscando.`
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
      const resultado = await this.leerJson();

      const actualizarProd = resultado.map((product) => {
        if (product.id === id) {
          return { ...updateProduct, id: id };
        }
        return product;
      });
      await fs.promises.writeFile(
        this.path,
        JSON.stringify(actualizarProd, null, 2)
      );
      console.log("El producto con el id: " + id + " fue actualizado.");
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  //Método para eliminar al producto que coincida con el id ingresado
  async deleteProduct  (id) {
    try {
      const resultado = await this.leerJson();
      const resultadoNuevo = resultado.filter(product => product.id !== id);
  
      await fs.promises.writeFile(this.path, JSON.stringify(resultadoNuevo, null, 2));
      console.log("El producto con el id: " + id + " fue eliminado");
  
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

async function array() {
  //Instancia para mostrar array vacío
  const test = new ProductManager();
  const arrayVacio = await test.getProductsVacío();
  console.log(arrayVacio);

  //Instancias para agregar productos
  const productTest = new ProductManager();

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
  await productTest.leerJson();

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
