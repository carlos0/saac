const nodemailer = require('nodemailer');
const createEmail = require('./create_email_html');

const emailSender = async (data) => {
  const mail_html = createEmail.emailPostRegister(data);

  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    ignoreTLS: false,
    tls: {
      rejectUnauthorized: false,
    },
    auth: {
      user: process.env.EMAil_USER,
      pass: process.env.EMAil_PASSWORD,
    },
  });
  try {
    const res = await transporter.sendMail({
      from: 'cmacuchapi@ine.gob.bo',
      to: data.email,
      //to: 'ing.diego.mamani@gmail.com',
      subject: "REGISTRO DE VOLUNTARIOS - CENSO 2024",
      html: mail_html
    });
    return res;
  } catch (error) {
    console.log("🚀 ~ file: mail.js:28 ~ emailSender ~ error:", error)
  }
}


module.exports = {
  emailSender
}