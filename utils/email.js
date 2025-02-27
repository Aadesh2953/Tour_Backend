import nodemailer from 'nodemailer';
import pug from 'pug';
import path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class Email{
  constructor(user,url)
  {
    
     this.name=user.name;
     this.sendTo=user.email
     this.from=process.env.EMAIL
     this.url=url
  }
  createTransport()
  {
    return  nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        service:"SendGrid",
        auth:{
          user:'apikey',
          pass:process.env.SENDGRID_API_KEY,
        }
    })
  }
  async sendMail(template,subject)
  {
    const html=pug.renderFile(path.join(__dirname, "../views/templates/", `${template}.pug`),{name:this.name,sendTo:this.sendTo,subject,url:this.url})
    const mailOptions={
        from:'shuklaanmish@gmail.com',
        to:this.sendTo,
        subject,
        html
    }
    await this.createTransport().sendMail(mailOptions);
  }
  async sendWelcome()
  {
   await this.sendMail('Welcome','Welcome To TourQuest')
  }
  async sendResetPassword()
  {
    await this.sendMail('resetPassword','Reset Your Password')
  }
}
// export const sendEmail=async(options)=>
// {

//     const transporter=nodemailer.createTransport({
//         host: 'smtp.gmail.com',
//         port: 587, // Use 465 if using secure:true
//         secure: false,
//         service:"gmail",
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
