const mongoose = require("mongoose");
const UserController = require("../src/controllers/user.controller.js");
const { userRepository } = require("../src/services/index.js");
const assert = require("assert");
const { expect } = require("chai");
const supertest = require("supertest");
const requester = supertest("http://localhost:8080");

mongoose.connect(
  "mongodb+srv://meligallegos:Paranaer1979@cluster0.kvvktyg.mongodb.net/Ecommerce?retryWrites=true&w=majority&appName=Cluster0"
);

describe("Testing Sessions Functionality", () => {
  // Variable para almacenar la cookie y usarla para los test
  let cookie;

  before(function () {
    this.userController = new UserController();
  });

  // ------Lógica Test Unitario para router.post("/", userTest.registerUser)------
  describe("Unit test with UserManager", function () {
    it("You must successfully register a user", async function () {
      const user = {
        first_name: "Test",
        last_name: "User",
        email: "testUser@gmail.com",
        password: "a1234",
        age: 34,
      };

      // Simulación de req y res
      const req = {
        body: user,
        logger: {
          info: () => {},
          warning: () => {},
          error: () => {},
        },
      };

      const res = {
        status: function (statusCode) {
          this.statusCode = statusCode;
          return this;
        },
        send: function (body) {
          this.body = body;
          return this;
        },
        cookie: function (name, value, options) {
          this.cookieName = name;
          this.cookieValue = value;
          this.cookieOptions = options;
          return this;
        },
        redirect: function (url) {
          this.redirectUrl = url;
          return this;
        },
      };
      await this.userController.registerUser(req, res);

      const registeredUser = await userRepository.findOne({
        email: user.email,
      });

      assert.ok(registeredUser, "User should be registered in the database");
      assert.strictEqual(
        registeredUser.first_name,
        user.first_name,
        "First name should match"
      );
      assert.strictEqual(
        registeredUser.last_name,
        user.last_name,
        "Last name should match"
      );
      assert.strictEqual(
        registeredUser.email,
        user.email,
        "Email should match"
      );
      assert.strictEqual(registeredUser.age, user.age, "Age should match");
    });
  });

  //------Lógica Test Avanzado con Supertest y Chai para router.post("/login", sessionTest.loginUser)------
  describe("Avanced test with Supertest and Chai", function () {
    it("The user must log in correctly and retrieve the cookie", async () => {
      const loginUser = {
        email: "testUser@gmail.com",
        password: "a1234",
      };

      const result = await requester
        .post("/api/users/login")
        .send(loginUser);

      //Result es la respuesta que me da "requester"; de la misma, busco los headers de la petición:
      const cookieResult = result.headers["set-cookie"][0];

      expect(cookieResult).to.be.ok;
      expect(cookieResult).to.include("HttpOnly", "Cookie should be HttpOnly");

      //Guardo en el objeto global que había declarado, el nombre y valor de la cookie
      cookie = {
        name: cookieResult.split("=")[0],
        value: cookieResult.split("=")[1],
      };

      expect(cookie.name).to.be.ok.and.equal("cookieToken");
      expect(cookie.value).to.be.ok;
    });

    //------Lógica Test Avanzado con Supertest y Chai para router.get("/profile", authenticateJWT, sessionTest.getProfile)------

    it("You must send the cookie that contains the user", async () => {
      //Ingreso a la ruta current enviando la cookie
      const response = await requester
        .get("/api/users/profile")
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .set("Content-Type", "application/json");

      expect(response.body.payload.email).to.be.equal("testUser@gmail.com");
      expect(response.body.payload)
        .to.have.property("first_name")
        .that.equals("Test");
      expect(response.body.payload)
        .to.have.property("last_name")
        .that.equals("User");
      expect(response.body.payload)
        .to.have.property("role")
        .that.equals("User");
    });

    //------Lógica Test Avanzado con Supertest y Chai para router.post("/:cid?/product/:pid?",verifyRole(["User", "Premium"]),authenticateJWT,cartTest.addProductToCart)------
    it("You should be able to add a product to the cart taking into account the IDs of both", async function () {
      const cartId = "66b04d1ddd0e7ff13dbce04f";

      const productToAdd = {
        title: "TestProduct",
        description: "TestProduct",
        price: 5000,
        thumbnail: ["a"],
        code: "abc83000",
        stock: 10,
        img: "a",
        category: "Test",
        status: true,
      };

      const productResponse = await requester
        .post("/api/products")
        .send(productToAdd);

      const prodId = productResponse.body.payload._id;

      const addToCartResponse = await requester
        .post(`/api/carts/${cartId}/product/${prodId}`)
        .set("Cookie", [`${cookie.name}=${cookie.value}`])
        .set("Content-Type", "application/json")
        .send({ quantity: 1 });

      //Verificaciones
      const redirectUrl = addToCartResponse.headers.location;
      
      expect(redirectUrl).to.be.ok;
      expect(addToCartResponse.headers.location).to.equal(`/carts/${cartId}`);
    });
  });

  after(async function () {
    //Desconecto Mongoose luego de cada test
    await mongoose.disconnect();
  });
});
