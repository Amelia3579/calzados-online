function removeProduct(cartId, productId) {
  console.log("prueba1:", cartId, productId)
  fetch(`/api/carts/${searchedCart._id}/product/${productId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al eliminar el producto del carrito.");
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error al eliminar el producto:", error.message);
    });
}

function emptyCart(cartId) {
  fetch(`/api/carts/${cartId}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Error al vaciar el carrito.");
      }
      location.reload();
    })
    .catch((error) => {
      console.error("Error al vaciar el carrito:", error.message);
    });
}
