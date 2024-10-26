const nodemailer = require("nodemailer");
require("dotenv").config();

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "utkarsh09jan@gmail.com", // Replace with your email
    pass: process.env.NODEMAILER_PASS, // Replace with your email password
  },
});

// Send email
function sendEmail(to, otp) {
  const html = `<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <div style="max-width: 600px; margin: 20px auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);">
        <div style="text-align: center; padding: 20px; background-color: #28a745; color: white; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Welcome to Shopmitra</h1>
        </div>
        <div style="margin: 20px 0; line-height: 1.6;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p style="color: #555;">Hi there,</p>
            <p style="color: #555;">We received a request to reset your password. Use the OTP below to complete your request:</p>
            <div style="font-size: 28px; font-weight: bold; color: #28a745; background: #e9f5e9; padding: 10px; border-radius: 5px; display: inline-block; margin: 20px 0;">
                ${otp}
            </div>
            <p style="color: #555;">If you did not request this, please ignore this email. Your account is safe.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 14px; color: #777;">
            <p>&copy; 2024 Shopmitra. All rights reserved.</p>
        </div>
    </div>
</body>
`;

  // Email options
  let mailOptions = {
    from: "utkarsh09jan@gmail.com", // Sender address
    to, // List of recipients
    subject: "Account reset request for shopmitra", // Subject line
    text: `Your otp for password reset is: ${otp}`, // Plain text body
    html, // HTML body
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
}

module.exports = { sendEmail };
