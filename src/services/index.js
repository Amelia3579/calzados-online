const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

const CartRepository = require("../repositories/cart.repository.js");
const cartRepository = new CartRepository();

const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();

const TicketRepository = require("../repositories/ticket.repository.js");
const ticketRepository = new TicketRepository();
module.exports = {
  productRepository,
  cartRepository,
  userRepository,
  ticketRepository,
};
