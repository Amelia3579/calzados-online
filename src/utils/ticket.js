// Función para calcular el precio total de la compra
const totalPurchasePrice = (products) => {
  let total = 0;

  products.forEach((item) => {
    total += item.product.price * item.quantity;
  });

  return total;
};

module.exports = { totalPurchasePrice };
