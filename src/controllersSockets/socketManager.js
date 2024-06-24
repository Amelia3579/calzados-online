const socket = require("socket.io");

const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();
const MessageModel = require("../models/message.model.js");

class SocketManager {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.productRepository = productRepository; 
    this.initSocketConnection();
  }

  async initSocketConnection() {
    this.io.on("connection", async (socket) => {
      console.log("Conección Socket");

      //Configuración para realtimeproducts.handlebars
      // Envío la lista de productos al cliente cuando se conecta
      socket.emit("products", await this.productRepository.find());

      //Manejo el evento "eliminarProducto" desde el cliente
      socket.on("deleteProduct", async (id) => {
        await this.productRepository.findByIdAndDelete(id);
        //Envío la lista de productos actualizada
        this.updatedProducts();
      });

      //Manejo el evento "agregarProducto" desde el cliente
      socket.on("addProduct", async (product) => {
        await this.productRepository.addProduct(product);
        //Envío la lista de productos actualizada
        this.updatedProducts();
      });

      //Configuración para chat.handlebars
      //Empiezo a escuchar los mensajes
      socket.on("message", async (data) => {
        //Guardo-creo documento con mensajes en MongoDB
        await MessageModel.create(data);

        //Recibo los mensajes de MongoDB
        const allMessages = await MessageModel.find();

        //Envío mensajes al cliente
        this.io.emit("logMessages", allMessages);
      });
    });
  }

  async updatedProducts() {
    this.io.emit("products", await this.productRepository.find());
  }
}
module.exports = SocketManager;
