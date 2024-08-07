const { Command } = require("commander");

const program = new Command();

program
  .option("-p <port>", "port where the server will be started", 8080)
  .option("--mode <mode>", "working mode", "development");
program.parse();

module.exports = program;
