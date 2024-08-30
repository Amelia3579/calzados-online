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
      console.error(
        `Error when verifying the purchase made. Please check the steps.: ${error.message}`
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
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(
        `Password reset failed. Please check the steps below.: ${error.message}`
      );
    }
  }

  //Método para envío de mail con la notificación de cuenta eliminada
  async sendEmailNotification(first_name) {
    try {
      const mailOptions = {
        from: "Mail App Test<ameliaisabelgallegos@gmail.com>", //Remitente
        to: "<meli_gallegos@yahoo.com.ar>", //Destinatario
        subject: "Account Deletion Notification",
        html: `
         <h1> Account Deletion Notice </h1>
         <p> Hello ${first_name}  </p>
         <p> We wanted to inform you that your account has been deleted due to inactivity.</p>
         <p> If you believe this was a mistake, please contact our support team. </p>
         <p> Thank you for using our service. </p>
        `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Error sending deletion notification: ${error.message}`);
    }
  }

  // //Método para envío de mail con la notificación a usuario premium de producto eliminado
  async sendEmailNotification(first_name, product_title) {
    try {
      const mailOptions = {
        from: "Mail App Test<ameliaisabelgallegos@gmail.com>", //Remitente
        to: "<meli_gallegos@yahoo.com.ar>", //Destinatario
        subject: "Product Removal Notification",
        html: `
           <h1> Product Removal Notice </h1>
           <p> Hello ${
            first_name}  </p>
           <p> We wanted to inform you that your product titled "<strong>${product_title}</strong>" has been removed from our platform.</p>
           <p> If you believe this action was taken in error, please contact our support team. </p>
           <p> Thank you for using our service. </p>
          `,
      };

      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      console.error(`Error sending deletion notification: ${error.message}`);
    }
  }
}

module.exports = EmailController;
