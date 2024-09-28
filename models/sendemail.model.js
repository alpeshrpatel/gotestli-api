const sendMail = async (transporter, mailOptions, result) => {
    try {
      // Send the email
      let info = await transporter.sendMail(mailOptions);
      
      // Return success message
      result(null, { msg: 'Email sent successfully!', info });
      console.log("Email sent successfully!");
    } catch (error) {
      // Handle any errors
      console.error("Error while sending email:", error);
      result(error, null);
    }
  };
  
  module.exports = sendMail;