const nodemailer = require("nodemailer");
const crypto = require("crypto");
require("dotenv").config({
  path: require("path").resolve(__dirname, "../.env"),
});

const generateVerificationCode = () => {
  return crypto.randomInt(100000, 999999);
};

const sendEmail = async (email) => {
  const transporter = nodemailer.createTransport({
    service: process.env.MAIL_SERVICE,
    auth: {
      user: process.env.MAIL_ID,
      pass: process.env.MAIL_PASSWORD,
    },
  });
  const otp = generateVerificationCode();
  console.log(`Generated OTP is ${otp}`);
  const mailOptions = {
    from: process.env.MAIL_ID,
    to: email,
    subject: "Email Verification for Sereynity",
    text: `Your email verification code is ${otp}`,
  };

  await transporter.sendMail(mailOptions);
  // OTP remainds active for a time duration of 120 seconds
  return { otp, expiresAt: Date.now() + 2 * 60 * 1000 };
};

module.exports = {
  sendEmail: sendEmail,
};
