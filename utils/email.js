import nodemailer from 'nodemailer';
export const sendEmail=async(options)=>
{
    const transporter=nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        auth:{
            user:process.env.EMAIL_USER,
            pass:process.env.EMAIL_PASSWORD
        }
    })
    const mailOptions={
        from:process.env.EMAIL,
        to:options.email,
        subject:options.subject,
        text:options.text,
        html:options.html
    }
    await transporter.sendMail(mailOptions);
}
