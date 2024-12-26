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
        message:options.message,
        text:options.text,
        html:options.html
    }
    await transporter.sendMail(mailOptions)
}
// async function sendEmail(to, subject, text) {
//     // Create a transporter object using SMTP transport
//     let transporter = nodemailer.createTransport({
//         service: 'gmail',
//         auth: {
//             user: 'your-email@gmail.com', // replace with your email
//             pass: 'your-email-password'   // replace with your email password
//         }
//     });

//     // Setup email data
//     let mailOptions = {
//         from: '"Your Name" <your-email@gmail.com>', // sender address
//         to: to, // list of receivers
//         subject: subject, // Subject line
//         text: text, // plain text body
//         // html: '<b>Hello world?</b>' // html body (optional)
//     };

//     // Send mail with defined transport object
//     try {
//         let info = await transporter.sendMail(mailOptions);
//         console.log('Message sent: %s', info.messageId);
//     } catch (error) {
//         console.error('Error sending email: %s', error);
//     }
// }

// module.exports = sendEmail;