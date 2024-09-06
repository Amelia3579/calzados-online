const socket = require("socket.io");

const ProductRepository = require("../repositories/product.repository.js");
const productRepository = new ProductRepository();

const MessageModel = require("../models/message.model.js");

const UserRepository = require("../repositories/user.repository.js");
const userRepository = new UserRepository();

const EmailController = require("../services/email.js");
const emailTest = new EmailController();

class SocketController {
  constructor(httpServer) {
    this.io = socket(httpServer);
    this.productRepository = productRepository;
    this.userRepository = userRepository;
    this.initSocketConnection();
  }

  async initSocketConnection() {
    this.io.on("connection", async (socket) => {
      console.log("Socket Connection");

      //Configuración para realtimeproducts.handlebar
      // Envío la lista de productos al cliente cuando se conecta
      socket.emit("products", await this.productRepository.find());

      //Manejo el evento "eliminarProducto" desde el cliente
      socket.on("deleteProduct", async (_id) => {
        try {
          const product = await this.productRepository.findById(_id);

          if (!product) {
            return socket.emit("error", {
              message: "Product not found.",
            });
          }

          // Obtengo el propietario del producto
          const owner = await this.userRepository.findOne({
            email: product.owner,
          });
          if (!owner) {
            return socket.emit("error", {
              message: "Owner not found.",
            });
          }

          // Verifico si el propietario es un usuario premium
          if (owner.role === "Premium") {
            // Envío correo de notificación al propietario
            await emailTest.sendEmailNotification(
              owner.first_name,
              product.title
            );
          }

          await this.productRepository.findByIdAndDelete(_id);
          //Envío la lista de productos actualizada
          this.updatedProducts();
        } catch (error) {
          socket.emit("error", {
            message:
              "You do not have the necessary permissions to remove products from the store.",
            details: error.message,
          });
        }
      });

      //Manejo el evento "agregarProducto" desde el cliente
      socket.on("addProduct", async (product, callback) => {
        try {
          const newProduct = await this.productRepository.addProduct(product);

          callback(newProduct._id);

          //Envío la lista de productos actualizada
          this.updatedProducts();
        } catch (error) {
          socket.emit("error", {
            message:
              "You do not have the necessary permissions to add products from the store.",
            details: error.message,
          });
        }
      });

      socket.on("updateProductImage", async ({ pid, imageUrl }) => {
        try {
          // Actualizar el producto con la URL de la imagen
          await this.productRepository.findByIdAndUpdate(pid, {
            img: imageUrl,
          });

          // Enviar la lista actualizada de productos
          this.updatedProducts();
        } catch (error) {
          socket.emit("error", {
            message: "Failed to update product image.",
            details: error.message,
          });
        }
      });

      // socket.on("addProduct", async (product) => {
      //   try {
      //     await this.productRepository.addProduct(product);

      //     //Envío la lista de productos actualizada
      //     this.updatedProducts();
      //   } catch (error) {
      //     socket.emit("error", {
      //       message:
      //         "You do not have the necessary permissions to add products from the store.",
      //       details: error.message,
      //     });
      //   }
      // });

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
module.exports = SocketController;
