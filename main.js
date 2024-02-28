//Creo clase con su constructor que recibe parámetro inicializado en 0
class ProductManager {
  constructor(products = []) {
    this.products = products;
  }

  //Creo método para crear id autoincrementable
  static id = 0;

  //Creo método para ingresar productos al array vacío
  addProduct(product) {
    const {
      title,
      description,
      price,
      thumbnail,
      code,
      stock
    } = product;

    const busquedaCod = (el) => el.code === code;

    //Validación para buscar código de producto
    if (this.products.some(busquedaCod)) {
      console.log(`El ${code} ya está ingresado.`);

      //Validación para que el producto quede ingresado una vez completos todos los campos
    } else if (
      title === "" ||
      description === "" ||
      price === 0 ||
      thumbnail === "" ||
      code === 0 ||
      stock === 0
    ) {
      console.log(
        "Para que el producto sea agregado correctamente, todos los campos tienen que estar completos"
      );

      //Agregado de producto con sus propiedades y id autoincrementable
    } else {
      const productsNew = this.products.push({
        ...product,
        id: ProductManager.id++,
      });

      return productsNew;
    }
  }
  //Creo método para devolver el array de productos
  getProducts() {
    return this.products;
  }
  //Creo método para buscar id de producto
  getProductsById(id) {
    const busquedaId = (el) => el.id === id;

    if (!this.products.find(busquedaId)) {
      console.log(`El id: ${id} no se encuentra en la lista. Puede continuar buscando.`);

    } else {
      console.log(`El id: ${id} pertenece al producto: `, this.products[id]);
    }
  }
}


//Instancia para mostrar array vacío
const test = new ProductManager();

console.log(test.getProducts());

//Instancia para agregar productos
const productTest = new ProductManager();

productTest.addProduct({
  title: "Producto Prueba",
  description: "Este es un producto prueba",
  price: 200,
  thumbnail: "Sin Imagen",
  code: "abc123",
  stock: 25,
});

productTest.addProduct({
  title: "Oreja de Srhek",
  description: "Suculenta",
  price: 2500,
  thumbnail: "Sin Imagen",
  code: "abc1234",
  stock: 25,
});

productTest.addProduct({
  title: "Cola de Burro",
  description: "Suculenta Colgante",
  price: 3000,
  thumbnail: "Sin Imagen",
  code: "abc1235",
  stock: 25,
});


//Producto para validar code repetido
productTest.addProduct({
  title: "Arbol de Jade",
  description: "Suculenta",
  price: 2000,
  thumbnail: "Sin Imagen",
  code: "abc123",
  stock: 25,
});

//Producto para validar campo incompleto
productTest.addProduct({
  title: "",
  description: "Suculenta Colgante",
  price: 3000,
  thumbnail: "Sin Imagen",
  code: "abc1236",
  stock: 25,
});


//Invoco instancia que mostrar productos agregados
console.log(productTest.getProducts());

//Invoco instancia para mostrar búsqueda de id
productTest.getProductsById(2);
productTest.getProductsById(8);