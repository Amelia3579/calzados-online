//Creo función que me va a lanzar por consola el mensaje de error
const infoError = (product) => {
  return `Los datos del producto están incompletos o son inválidos. Por favor verifica la información recibida:
-Title: String, y se recibió: ${product.title}
-Description: String, y se recibió: ${product.description}
-Price: Number, y se recibió ${product.price}
-Thumbnail: [], y se recibió ${product.thumbnail}
-Code: String, y se recibió ${product.code}
-Stock: Number, y se recibió ${product.stock}
-Image: String, y se recibió ${product.img}
-Category: String, y se recibió ${product.category}
-Status: Boolean, y se recibió ${product.status}
`;
};

module.exports = infoError;
