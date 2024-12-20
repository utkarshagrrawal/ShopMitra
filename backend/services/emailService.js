const nodemailer = require("nodemailer");

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "utkarsh09jan@gmail.com", // Replace with your email
    pass: process.env.NODEMAILER_PASS, // Replace with your email password
  },
});

// Send email
function sendEmail(to, subject, text, html) {
  // Email options
  let mailOptions = {
    from: "utkarsh09jan@gmail.com", // Sender address
    to, // List of recipients
    subject, // Subject line
    text, // Plain text body
    html, // HTML body
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
    }
  });
}

module.exports = { sendEmail };
