const bcrypt = require("bcrypt");

//Funciones para aplicar el hasheo
const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

const isValidPassword = (password, user) =>
  bcrypt.compareSync(password, user.password);

module.exports = {
  createHash,
  isValidPassword,
};
