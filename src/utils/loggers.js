const winston = require("winston");
const {configObject} = require("../config/config.js");


//Defino sistema de niveles
const levelsConfiguration = {
  level: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5,
  },
};

//Logger para desarrollo
const developmentLogger = winston.createLogger({
  //Paso la configuración de los niveles
levels: levelsConfiguration.level,
  //Configuro un nuevo transporte que será la consola
  transports: [
    new winston.transports.Console({
    level: "debug"  
    }),
  ],
});

//Logger para producción
const productionLogger = winston.createLogger({
  levels: levelsConfiguration.level,
  transports: [
    new winston.transports.Console({
      level: "info",
    }),
    //Agrego el transporte de archivos:
    new winston.transports.File({
      filename: "./errors.log",
      level: "error",
    }),
  ],
});

//Defino logger a utilizar según variable de entorno
const optionsLogger =
  configObject.mode === "production" ? productionLogger : developmentLogger;

// //Creo un middleware
const addLogger = (req, res, next) => {
  req.logger = optionsLogger;
  req.logger.http(
    `${req.method} en ${req.url} - ${new Date().toLocaleTimeString()}`
  );
  next();
};

module.exports = addLogger;
