import nodemailer from 'nodemailer';
import pug from 'pug';
const __dirname = path.dirname(__filename);
export class Email{
  constructor(user,url)
  {
     this.name=user.split(' ')[0];
     this.sendTo=user.email
     this.from=process.env.EMAIL
     this.url=url
  }
  createTransport()
  {
    return this.nodemailer.createTransport({
        host:'smtp.gmail.com',
        port:587,
        secure:false,
        servie:"gmail",
        auth:{
          user:process.env.EMAIL_USER,
          pass:process.env.EMAIL_PASSWORD,
        }
    })
  }
  async sendMail(template,subject)
  {
    const html=pug.renderFile(`../views/${template}.pug`,{name:this.name,sendTo:this.sendTo,subject})
    const mailOptions={
        from:process.env.EMAIL,
        to:this.sendTo,
        subject,
        // text:htm,Implement Later
        html
    }
    await this.createTransport().sendMail(mailOptions);
  }
  async sendWelcome()
  {
   await this.sendMail('Welcome','Welcome To TourQuest')
  }
}
export const sendEmail=async(options)=>
{

    const transporter=nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587, // Use 465 if using secure:true
        secure: false,
        service:"gmail",
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }   })
    const mailOptions={
        from:process.env.EMAIL,
        to:options.email,
        subject:options.subject,
        text:options.text,
        html:options.html
    }
    await transporter.sendMail(mailOptions);
}
