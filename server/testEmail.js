require("dotenv").config();

console.log("EMAIL:", process.env.EMAIL_USER);
console.log(
  "PASSWORD LENGTH:",
  process.env.EMAIL_APP_PASSWORD
    ? process.env.EMAIL_APP_PASSWORD.length
    : "NOT FOUND"
);

const sendEmail = require("./utils/sendEmail");

const testEmail = async () => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);

    await sendEmail(
      "fazalmir48@gmail.com",
      "Dr Shabir Portfolio OTP",
      `Your OTP is: ${otp}`
    );

    console.log("OTP SENT:", otp);
  } catch (error) {
    console.error("Unable to send OTP.");
    console.error(error.message);
  }
};

testEmail();