const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999);
};

const sendEmail = async (email) => {
  try {
    console.log(process.env.MAIL_ID);
    const transporter = nodemailer.createTransport({
      service: process.env.MAIL_SERVICE,
      auth: {
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.MAIL_ID,
      to: email,
      subject: "Email Verification for Sereynity",
      text: `Your email verification code is ${generateVerificationCode()}`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    throw error;
  }
};

sendEmail("alimalim77@gmail.com");
