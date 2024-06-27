//Clase para generar mis propios errores
class CustomError {
  static createError({ name = "Error", cause = "Unknown", message, code = 1 }) {
    //Genero el objeto error y le paso una frase que será el message que recibo por parámetro
    const error = new Error(message);
    //Configuro sus propiedades
    error.name = name;
    error.cause = cause;
    error.code = code;
    //Lanzo el error
    throw error;
  }
}

module.exports = CustomError;
