import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  // Create a test account if we don't have SMTP credentials
  let testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.ethereal.email",
    port: process.env.SMTP_PORT || 587,
    auth: {
      user: process.env.SMTP_EMAIL || testAccount.user,
      pass: process.env.SMTP_PASSWORD || testAccount.pass,
    },
  });

  const message = {
    from: `${process.env.FROM_NAME || "Proctoring System"} <${process.env.FROM_EMAIL || "noreply@proctoring.com"}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.html,
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
  // Provide the preview URL in the console for easy testing
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

export default sendEmail;
