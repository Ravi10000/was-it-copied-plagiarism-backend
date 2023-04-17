import { createTransport } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import dotEnv from "dotenv";
dotEnv.config();
// console.log(process.env);
async function sendEmail({ to, verificationLink }) {
  const transporter = createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "lorena.corwin@ethereal.email",
      pass: "kHNq5ZbVRBHXKqpxXM",
    },
  });
  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve("./"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./view"),
    extName: ".hbs",
  };
  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: `verify email <lorena.corwin@ethereal.email>`,
    to,
    subject: "Verify your email",
    template: "verify-email",
    context: {
      verificationLink,
    },
    // html: `<h1><a href="${verificationLink}">verify</a></h1>`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    error && console.log({ error });
    info && console.log({ info });
  });
}

// sendEmail({
//   to: "ravisince2k@gmail.com",
//   subject: "test mail",
//   text: "This is a test mail",
// });
export default sendEmail;

// sendEmail(
//   "ravisince2k@gmail.com",
//   "test mail",
//   `
//   <html>
//   <b>Hello World</b>
//     <p style={color: royalblue; font-size: 24px; background-color: grey;}>This is a test mail</p>
//   </html>
//   `
// );
