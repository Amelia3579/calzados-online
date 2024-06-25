// Función para calcular el precio total de la compra
const totalPurchase = (products) => {
  if (!Array.isArray(products)) {
    throw new TypeError("Error al intentar obtener los productos.");
  }
  let total = 0;

  products.forEach((elem) => {
    total += elem.product.price * elem.quantity;
  });
  return total;
};

module.exports = totalPurchase;
