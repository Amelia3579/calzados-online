const { faker } = require("@faker-js/faker");

const generateProducts = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    price: faker.commerce.price(),
    thumbnail: faker.image.url(),
    code: faker.string.uuid(),
    stock: parseInt(faker.string.numeric()),
    image: faker.image.avatar(),
    category: faker.commerce.department(),
    status: faker.helpers.arrayElement(["true", "false"]),
  };
};

const generateUsers = () => {
  const quantityProducts = parseInt(faker.string.numeric());

  let products = [];

  for (let i = 0; i < quantityProducts; i++) {
    products.push(generateProducts());
  }

  return {
    id: faker.database.mongodbObjectId(),
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    age: faker.number.int({ min: 18, max: 80 }),
    role: faker.helpers.arrayElement(["Admin", "User"]),
    products,
  };
};

module.exports = { generateProducts, generateUsers };
