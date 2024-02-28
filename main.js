class ProductManager {
  constructor(products = []) {
    this.products = products;
  }
  static id = 0;

  addProduct(product) {
    const { title, description, price, thumbnail, code, stock } = product;

    const busquedaCod = (el) => el.code === code;

    if (this.products.some(busquedaCod)) {
      console.log(`El ${code} ya está ingresado.`);
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
    } else {
      const productsNew = this.products.push({
        ...product,
        id: ProductManager.id++,
      });

      return productsNew;
    }
  }

  getProducts() {
    return this.products;
  }

  getProductsById(id) {
    const busquedaId = (el) => el.id === id;

    if (!this.products.find(busquedaId)) {
      console.log(`El id: ${id} no se encuentra en la lista. Puede continuar buscando.`);

    } else {   
      console.log(`El id: ${id} pertenece al producto: `, this.products[id] );
    }
  }
}

const test = new ProductManager();
const productTest = new ProductManager();

console.log(test.getProducts());

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

productTest.addProduct({
  title: "Arbol de Jade",
  description: "Suculenta",
  price: 2000,
  thumbnail: "Sin Imagen",
  code: "abc123",
  stock: 25,
});

productTest.addProduct({
  title: "",
  description: "Suculenta Colgante",
  price: 3000,
  thumbnail: "Sin Imagen",
  code: "abc1236",
  stock: 25,
});

console.log(productTest.getProducts());

productTest.getProductsById(2);
