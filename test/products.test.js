const mongoose = require("mongoose");
const ProductManager = require("../src/controllers/productManagerDb.js");
const assert = require("assert");
const { expect } = require("chai");
const supertest = require("supertest");
const requester = supertest("http://localhost:8080");

mongoose.connect(
  "mongodb+srv://meligallegos:Paranaer1979@cluster0.kvvktyg.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0"
);

describe("Testing Product Functionality", () => {
  // Variable para almacenar el ID del producto de prueba
  let testProductId;

  before(function () {
    this.productManager = new ProductManager();
  });

  //Limpio la base de datos cada vez que testeo
  beforeEach(async function () {
    await mongoose.connection.collections.products.deleteOne({
      _id: testProductId,
    });
    testProductId = null;
  });

  // ------Lógica Test Unitario para router.post("/", productTest.addProduct)------
  describe("Unit test with ProductManager", function () {
    it("Should create a new product and return the product with correct data", async function () {
      const newProduct = {
        title: "Test product",
        description: "Test product",
        price: 5000,
        thumbnail: ["a"],
        code: "abc83000",
        stock: 10,
        img: "a",
        category: "Test",
        status: true,
      };

      const result = await this.productManager.addProduct(newProduct);
      testProductId = result._id;

      assert.ok(result._id, "Product should have an _id");
      assert.strictEqual(typeof result, "object", "Result should be an object");
      assert.strictEqual(result.title, newProduct.title, "Title should match");
      assert.strictEqual(
        result.description,
        newProduct.description,
        "Description should match"
      );
      assert.strictEqual(result.price, newProduct.price, "Price should match");
      assert.deepStrictEqual(
        result.thumbnail,
        newProduct.thumbnail,
        "Thumbnail should match"
      );
      assert.strictEqual(result.code, newProduct.code, "Code should match");
      assert.strictEqual(result.stock, newProduct.stock, "Stock should match");
      assert.strictEqual(result.img, newProduct.img, "Image should match");
      assert.strictEqual(
        result.category,
        newProduct.category,
        "Category should match"
      );
      assert.strictEqual(result.status, newProduct.status, "Status should match");
    });
  });

  //------Lógica Test de Integración con Supertest y Chai para router.put("/:pid", productTest.updateProduct)------
  describe("Integration test with Supertest and Chai", function () {
    it("Should update a product taking into account its ID.", async function () {
      const idProductToUpdate = "66b02a08f58ead83ca611a83";

      const productToUpdate = {
        title: "Cola de Mono",
        description: "Necesita riego moderado",
        price: 5000,
        thumbnail: ["a"],
        code: "abc123468",
        stock: 10,
        img: "a",
        category: "Cactus",
        status: true,
      };

      const { statusCode, body } = await requester
        .put(`/api/products/${idProductToUpdate}`)
        .send(productToUpdate);

      expect(statusCode).to.equal(200);
      expect(body.payload).to.have.property("title", productToUpdate.title);
      expect(body.payload).to.have.property(
        "description",
        productToUpdate.description
      );
      expect(body.payload).to.have.property("price", productToUpdate.price);
      expect(body.payload)
        .to.have.property("thumbnail")
        .that.deep.equals(productToUpdate.thumbnail);
      expect(body.payload).to.have.property("code", productToUpdate.code);
      expect(body.payload).to.have.property("stock", productToUpdate.stock);
      expect(body.payload).to.have.property("img", productToUpdate.img);
      expect(body.payload).to.have.property(
        "category",
        productToUpdate.category
      );
      expect(body.payload).to.have.property("status", productToUpdate.status);
    });
  });

  //------Lógica Test de Integración con Supertest y Chai para router.delete("/:pid", productTest.deleteProduct)------
  describe("Integration test with Supertest and Chai", function () {
    it("Should delete a product taking into account its ID", async function () {
      const productToDelete = {
        title: "TestProduct",
        description: "Test",
        price: 5000,
        thumbnail: ["a"],
        code: "abc123444",
        stock: 10,
        img: "a",
        category: "Test",
        status: true,
      };

      //Recupero el _id de productToDelete
      const {
        body: {
          payload: { _id },
        },
      } = await requester.post("/api/products").send(productToDelete);

      const { statusCode, body } = await requester.delete(`/api/products/${_id}`);
      
      expect(statusCode).to.equal(200);
      expect(body).to.have.property("message").that.equals("The product was successfully deleted");
    });
  });
  after(async function () {
    //Desconecto Mongoose luego de cada test
    await mongoose.disconnect();
  });
});
