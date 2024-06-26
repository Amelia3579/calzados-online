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

module.exports = { generateProducts };
