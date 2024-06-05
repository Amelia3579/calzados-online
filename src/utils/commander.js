const { Command } = require("commander");

const program = new Command();

program
  .option("-p <port>", "puerto donde se iniciará el servidor", 8080)
  .option("--mode <mode>", "modo de trabajo", "desarrollo");
program.parse();

module.exports = program;
