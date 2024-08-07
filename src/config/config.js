const dotenv = require("dotenv");
const program = require("../utils/commander.js");

//Recibo el modo de trabajo
const { mode } = program.opts();

//Cargo el archivo .env
dotenv.config({
  path: mode === "production" ? "./.env.production" : "./.env.development",
});

const configObject = {
  mongo_url: process.env.MONGO_URL,
  port: process.env.PORT,
  mode,
};

module.exports = { configObject };
