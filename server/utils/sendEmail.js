const nodemailer = require("nodemailer");

const getEmailConfig = () => {
  const user = String(process.env.EMAIL_USER || "").trim();
  const password = String(
    process.env.EMAIL_APP_PASSWORD || process.env.EMAIL_PASSWORD || ""
  ).replace(/\s+/g, "");
  const host = String(process.env.EMAIL_HOST || "smtp.gmail.com").trim();
  const port = Number(process.env.EMAIL_PORT || 587);
  const from = String(process.env.EMAIL_FROM || user).trim();

  if (!user) {
    throw new Error("EMAIL_USER is missing in server/.env");
  }
  if (!password || password === "YOUR_GMAIL_APP_PASSWORD" || password === "YOUR_16_CHARACTER_GMAIL_APP_PASSWORD") {
    throw new Error("A valid Gmail App Password is missing. Set EMAIL_APP_PASSWORD in server/.env.");
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("EMAIL_PORT must be a valid port number.");
  }

  return { user, password, host, port, secure: port === 465, from };
};

const createTransporter = () => {
  const { user, password, host, port, secure } = getEmailConfig();

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass: password,
    },
    requireTLS: port === 587,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 20000,
  });
};

const sendEmail = async (to, subject, text, replyTo = undefined) => {
  const config = getEmailConfig();
  const transporter = createTransporter();

  try {
    await transporter.verify();
  } catch (error) {
    throw new Error(
      `Gmail SMTP authentication/connection failed: ${error.message}`
    );
  }

  try {
    const info = await transporter.sendMail({
      from: `"Dr Muhammad Shabir Afridi Portfolio" <${config.from}>`,
      to: String(to).trim(),
      subject,
      text,
      ...(replyTo ? { replyTo } : {}),
    });

    console.log("Email sent successfully:", info.messageId);
    return info;
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  } finally {
    transporter.close();
  }
};

module.exports = sendEmail;
