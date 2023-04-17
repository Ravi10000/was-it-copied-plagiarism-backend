// const hbs = require('nodemailer-express-handlebars');
import hbs from "nodemailer-express-handlebars";
//attach the plugin to the nodemailer transporter
transporter.use("compile", hbs(options));
//send mail with options
const mail = {
  from: "from@domain.com",
  to: "to@domain.com",
  subject: "Test",
  template: "verify-email",
  context: {
    token: "id",
  },
};
transporter.sendMail(mail);
