//Creo función que me va a lanzar por consola el mensaje de error
const infoError = (product) => {
  return `The product data is incomplete or invalid. Please verify the information.:
-Title: String, and received: ${product.title}
-Description: String, and received: ${product.description}
-Price: Number, and received ${product.price}
-Thumbnail: [], and received ${product.thumbnail}
-Code: String, and received ${product.code}
-Stock: Number, and received ${product.stock}
-Image: String, and received ${product.img}
-Category: String, and received ${product.category}
-Status: Boolean, and received ${product.status}
`;
};

module.exports = infoError;
