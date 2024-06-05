const dotenv = require("dotenv");

//Cargo el archivo .env
dotenv.config({ path: './.env.desarrollo' });

const configObject = {
  mongo_url: process.env.MONGO_URL,
  puerto: process.env.PUERTO
};

module.exports = configObject;
