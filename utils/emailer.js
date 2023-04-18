import { createTransport } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import path from "path";
import dotEnv from "dotenv";
dotEnv.config();

async function sendEmail({ to, verificationLink }) {
  const transporter = createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  const handlebarOptions = {
    viewEngine: {
      extName: ".hbs",
      partialsDir: path.resolve("./"),
      defaultLayout: false,
    },
    viewPath: path.resolve("./views"),
    extName: ".hbs",
  };
  transporter.use("compile", hbs(handlebarOptions));

  const mailOptions = {
    from: `verify email <plagiarism-checker@gmail.com>`,
    to,
    subject: "Verify your email",
    template: "verify-email",
    context: {
      apiUrl: process.env.API_URL,
      verificationLink,
    },
  };

  return await transporter.sendMail(mailOptions);
  // transporter.sendMail(mailOptions, (error, info) => {
  //   error && console.log({ error });
  //   info && console.log({ info });
  // });
}

export default sendEmail;
