import nodemailer from "nodemailer";
import pug from "pug";
import path from "path";
import { fileURLToPath } from "url";
import { AdminMail } from "../views/templates/AdminMail.js";
import { customerMail } from "../views/templates/CustomerMail.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Email {
  constructor(user, url) {
    this.name = user.name;
    this.sendTo = user.email;
    this.from = process.env.EMAIL;
    this.url = url;
  }
  createTransport() {
    return nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }
  async sendMail(template, subject, data = {}) {
    // console.log("template", template);
    let html;
    if (template === "AdminMail" || template == "CustomerMail") {
      if (!data) return;

      if (template == "AdminMail") html = AdminMail(data);
      else html = customerMail(data);
    } else {
      html = pug.renderFile(
        path.join(__dirname, "../views/templates/", `${template}.pug`),
        { name: this.name, sendTo: this.sendTo, subject, url: this.url }
      );
    }
    const mailOptions = {
      from: "shuklaanmish@gmail.com",
      to: "shuklaanmish@gmail.com",
      subject,
      html,
    };
    this.createTransport().sendMail(mailOptions);
  }
  async sendWelcome() {
    await this.sendMail("Welcome", "Welcome To TourQuest");
  }
  async sendResetPassword() {
    // console.log('called')
    await this.sendMail("resetPassword", "Reset Your Password");
  }
  async sendTourStartMailAdmin(data) {
    let subject = `Tour Started: ${data?.name} - ID: ${data?._id}`;
    await this.sendMail("AdminMail", subject, data);
  }
}
// export const sendEmail=async(options)=>
// {

//     const transporter=nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 587, // Use 465 if using secure:true
//         secure: false,
// p        service:"gmail",
//         auth:{
//             user:process.env.EMAIL_USER,
//             pass:process.env.EMAIL_PASSWORD
//         }   })
//     const mailOptions={
//         from:process.env.EMAIL,
//         to:options.email,
//         subject:options.subject,
//         text:options.text,
//         html:options.html
//     }
//     await transporter.sendMail(mailOptions);
// }
