const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('Initializing email transport with user:', process.env.EMAIL_USER);
  
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
    debug: true, // Enable debug logging
    logger: true  // Enable built-in logger
  });

  // Define email options
  const message = {
    from: `"Expenses Management" <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    text: options.message,
    html: options.message.replace(/\n/g, '<br>'),
  };

  try {
    console.log('Verifying email configuration...');
    // Verify transporter configuration
    await transporter.verify();
    console.log('Email configuration verified successfully');

    console.log('Attempting to send email to:', options.email);
    // Send email
    const info = await transporter.sendMail(message);
    console.log('Message sent successfully: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('Error details:', {
      code: error.code,
      command: error.command,
      response: error.response,
      responseCode: error.responseCode,
      stack: error.stack
    });
    throw error;
  }
};

module.exports = sendEmail; 