//------Lógica para los botones "removeProduct" y "emptyCart en cart.handlebars------

function removeProduct(cartId, productId) {
  fetch(`/api/carts/${cartId}/product/${productId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error removing product from cart.");
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error removing de product:", error.message);
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
      console.error("Error emptying cart:", error.message);
    });
}
