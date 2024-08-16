const mongoose = require("mongoose");
const CartController = require("../src/controllers/cart.controller.js");
const assert = require("assert");
const { expect } = require("chai");
const supertest = require("supertest");
const requester = supertest("http://localhost:8080");

mongoose.connect(
  "mongodb+srv://meligallegos:Paranaer1979@cluster0.kvvktyg.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0"
);

describe("Testing Cart Functionality", () => {
  // Variable para almacenar el ID del carrito de prueba
  let testCartId;

  before(function () {
    this.cartManager = new CartController();
  });

  //Limpio la base de datos cada vez que testeo
  beforeEach(async function () {
    await mongoose.connection.collections.carts.deleteOne({ _id: testCartId });
    testCartId = null;
  });

  // ------Lógica Test Unitario para router.post("/", cartTest.createCart)------
  describe("Unit test with CartManager", function () {
    it("Should create a new cart and return the cart with correct data", async function () {
      const cartData = {
        products: [],
      };

      // Simulación de req y res
      const req = { body: cartData };
      const res = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        send: function (body) {
          this.body = body;
          return this;
        },
        body: null,
      };

      await this.cartManager.createCart(req, res);

      const result = res.body;
      testCartId = result.payload._id;

      assert.ok(result.payload._id, "Cart should have an _id");
      assert.ok(result.payload.products, "The cart must have a products field");
      assert.strictEqual(
        result.payload.products.length,
        0,
        "The cart's products should be an empty array"
      );
    });
  });

  //------Lógica Test de Integración con Chai para router.put("/:cid", cartTest.updateCartProduct)------
  describe("Integration test with Supertest and Chai", function () {
    it("Should update a cart taking into account its ID", async function () {
      const idExistingCart = "66b04d1ddd0e7ff13dbce04f";

      const updatedData = {
        product: "66241f5cf5959a6f14e55c31",
        quantity: 25,
      };

      const { statusCode, body } = await requester
        .put(`/api/carts/${idExistingCart}`)
        .send(updatedData);

      expect(statusCode).to.equal(200);
      expect(body.success).to.be.true;
      expect(body.message).to.include(
        `The cart ${idExistingCart} was successfully updated.`
      );
    });
  });
  //------Lógica Test Avanzado con Supertest y Chai para router.post("/:cid?/product/:pid?",verifyRole(["User", "Premium"]),authenticateJWT,cartTest.addProductToCart)------
  //Está desarrollada en sessions.test.js

  after(async function () {
    //Desconecto Mongoose luego de cada test
    await mongoose.disconnect();
  });
});
