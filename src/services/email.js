//------Lógica para Envío de Emails (3° Práctica Integradora)------
const nodemailer = require("nodemailer");

//Creo clase para gestionar el envío de los emails
class EmailController {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      port: 587,
      auth: {
        user: "ameliaisabelgallegos@gmail.com",
        pass: "cksa mrzn zham knqd",
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  //Método para envío de mail con el ckeck out de la compra
  async sendEmailCheckOut(first_name, ticket) {
    try {
      const mailOptions = {
        from: "Mail App Test<ameliaisabelgallegos@gmail.com>", //Remitente
        to: "<meli_gallegos@yahoo.com.ar>", //Destinatario
        subject: "Check Out Purchase",
        html: `
         <h1> Ckeck Out Purchase </h1>
         <p> Thanks for your Purchase ${first_name} </p>
         <p> Your Ticket Number is ${ticket} </p>
         <h2> Come Back Soon </h2>
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(
        "Error when verifying the purchase made. Please check the steps.",
        error
      );
    }
  }

  //Método para envío de mail con el restablecimiento de la contraseña
  async sendEmailReset(first_name, token) {
    try {
      const mailOptions = {
        from: "Mail App Test<ameliaisabelgallegos@gmail.com>", //Remitente
        to: "<meli_gallegos@yahoo.com.ar>", //Destinatario
        subject: "Password Reset",
        html: `
         <h1> Password Reset </h1>
         <p> Hello ${first_name}  </p>
         <p> Are you about to reset your password</p>
         <h2> Your confirmation code is: ${token} and expires in 1 hour  </h2>
         <a href= "http://localhost:8080/resetpassword" > Enter the code </a>
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.log(
        "Password reset failed. Please check the steps below..",
        error
      );
    }
  }
}

module.exports = EmailController;
