import nodemailer from 'nodemailer';

const sendEmail = async function (email, subject, message) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USERNAME,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  // console.log('Transporter configuration:', {
  //   host: process.env.SMTP_HOST,
  //   port: process.env.SMTP_PORT,
  //   secure: process.env.SMTP_PORT === '465',
  //   user: process.env.SMTP_USERNAME,
  //   pass: process.env.SMTP_PASSWORD,
  // });

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM_EMAIL,
      to: email,
      subject: subject,
      html: message,
    });
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};

export default sendEmail;



// import nodemailer from "nodemailer";

// // async..await is not allowed in global scope, must use a wrapper
// const sendEmail = async function (email, subject, message) {
//   // create reusable transporter object using the default SMTP transport
//   let transporter = nodemailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: process.env.SMTP_PORT,
//     secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
//     auth: {
//       user: process.env.SMTP_USERNAME,
//       pass: process.env.SMTP_PASSWORD,
//     },
//   });

//   // send mail with defined transport object
//   await transporter.sendMail({
//     from: process.env.SMTP_FROM_EMAIL, // sender address
//     to: email, // user email
//     subject: subject, // Subject line
//     html: message, // html body
//   });
// };

// export default sendEmail;
