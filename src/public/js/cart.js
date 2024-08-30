//------Lógica para los botones "removeProduct" "emptyCart" en cart.handlebars------

function removeProduct(cartId, prodId) {
  fetch(`/api/carts/${cartId}/product/${prodId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error removing the product from cart.");
      }
      location.reload();
    })
    .catch((error) => {
      console.error(`Error removing the product from cart: ${error.message}`);
    });
}

function emptyCart(cartId) {
  fetch(`/api/carts/${cartId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error emptying cart.");
      }
      location.reload();
    })
    .catch((error) => {
      console.error(`Error emptying cart: ${error.message}`);
    });
}
