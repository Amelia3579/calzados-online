//Importo File System
const fs = require("fs");

//Creo constante para guardar path
const guardarPath = "./array-products.json";

//Creo clase con su constructor que recibe los parámetros solicitados
class ProductManager {
  //Variable para generar id autoincrementable
  static id = 0;

  constructor(products = [], path) {
    this.products = products;
    this.path = path;
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
    const productsNew = this.products.push({
      ...product,
      id: ++ProductManager.id,
    });
    console.log(productsNew);
  }

  //Creación/guardado del archivo con promesa
  async crearJson() {
    try {
      await fs.promises.writeFile(
        guardarPath,
        JSON.stringify(this.products, null, 2)
      );
    } catch (error) {
      console.log(error);
    }
  }

  // //Lectura del archivo con promesa
  async leerJson() {
    try {
      const respuesta = await fs.promises.readFile(guardarPath, "utf-8");
      const respuesta2 = JSON.parse(respuesta);
      console.log(respuesta2);
      return
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  // //Método para mostrar el array de productos
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

//   //Método para buscar id de producto
//   async getProductById(id) {
//     try {
//       const resultado = await this.leerJson();

//       const buscarId = resultado.find((el) => el.id === id);

//       if (buscarId) {
//         console.log(
//           `Búsqueda por id\nEl id: ${id} pertenece al producto: `,
//           buscarId
//         );
//       } else {
//         console.log(
//           `Búsqueda por id\nEl id: ${id} no fue encontrado. Puede seguir buscando.`
//           // `Búsqueda por id\nEl id: ${id} no se encuentra en la lista. Puede continuar buscando.`,
//         );
//       }
//     } catch (error) {
//       console.log(error);
//       throw error;
//     }
//   }
// }

//Método para reemplazar producto
// async updateProduct(id) {
//   const resultado = await this.leerJson();

//   if (resultado.find((el) => el.id === id)) {
//     let resultadoNuevo = await fs.promises.writeFile(
//       guardarPath,
//       JSON.stringify(resultado[id], null, 2));
//       console.log (
//         "La lista actualizada es la siguiente : " + JSON.stringify(resultadoNuevo, null, 2)
//       );
//       return
//   } else {
//     console.log(
//       "Los productos ingresados son: " + JSON.stringify(resultado, null, 2)
//     );
//     return
//   }
// }
// }
}
async function array() {
  // //Instancia para mostrar array vacío
  // const test = new ProductManager();

  //Instancias para agregar productos
  const productTest = new ProductManager();
  await productTest.leerJson();


  await productTest.addProduct(
    {
      title: "Producto Prueba",
      description: "Este es un producto prueba",
      price: 200,
      thumbnail: "Sin Imagen",
      code: "abc123",
      stock: 25,
    },
    // "./array-products.json"
  );

  await productTest.addProduct(
    {
      title: "Oreja de Srhek",
      description: "Suculenta",
      price: 2500,
      thumbnail: "Sin Imagen",
      code: "abc1234",
      stock: 25,
    },
    // "./array-products.json"
  );

  await productTest.addProduct(
    {
      title: "Cola de Burro",
      description: "Suculenta Colgante",
      price: 3000,
      thumbnail: "Sin Imagen",
      code: "abc1235",
      stock: 25,
    },
    // "./array-products.json"
  );

  // //Producto para reemplazar al producto que coincida con su id
  // productTest.addProduct(
  //   {
  //     title: "Aloe Vera",
  //     description: "Suculenta",
  //     price: 2500,
  //     thumbnail: "Sin Imagen",
  //     code: "abc1237",
  //     stock: 25,
  //   },
  //   "./array-products.json"
  // );

  //Producto para validar code repetido
  await productTest.addProduct(
    {
      title: "Arbol de Jade",
      description: "Suculenta",
      price: 2000,
      thumbnail: "Sin Imagen",
      code: "abc123",
      stock: 25,
    },
    // "./array-products.json"
  );

  //Producto para validar campo incompleto
 await productTest.addProduct(
    {
      title: "",
      description: "Suculenta Colgante",
      price: 3000,
      thumbnail: "Sin Imagen",
      code: "abc1236",
      stock: 25,
    },
    // "./array-products.json"
  );

  // //Invoco instancia que mostrar array vacío
  // const arrayVacio = await test.getProducts();
  // console.log(arrayVacio);

  // //Invoco instancia para mostrar productos agregados
  const arrayProducts = await productTest.getProducts();
  console.log(arrayProducts);

  //Invoco instancias para hacer búsqueda de producto por id
  // productTest.getProductById(8);
  // productTest.getProductById(2);

  //Invoco instancia para reemplazar producto
  // productTest.updateProduct(3);
}
array();
