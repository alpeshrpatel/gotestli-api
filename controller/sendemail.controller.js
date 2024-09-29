const nodemailer = require("nodemailer");
require("dotenv").config();
const sendMail = require('../models/sendemail.model')

exports.sendReminder = async (req, res) => {
  const {userResultId,studentData, quizData, instructor} = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for port 465, false for other ports
    auth: {
      user: process.env.USER,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: {
      name: "Gotestli",
      address: process.env.USER,
    }, // sender address
    to: studentData.email, // list of receivers
    subject: "🚀 Reminder: Your Quiz Awaits! Don't Miss It! 🎯", // Subject line
    text: `
    Hi ${studentData.first_name},
    
    I hope you're doing great! 🌟 This is a friendly reminder to complete your quiz on **${quizData.title}**. ⏰ The quiz is an important step in reinforcing what you've learned, and I know you'll do amazing! 💪
    
    Quiz Details:
    - Topic: ${quizData.title}
    - Questions: ${quizData.no_of_question}
    - Duration: ${quizData.time_duration} Minutes
    
    Make sure you're prepared, and don't forget to review your notes before starting! 📚 If you have any questions or need help, feel free to reach out! 📨
    
    Good luck! 🍀 I'm rooting for you, and I can't wait to see your results! 🎉
    
    Best regards,
    ${instructor}
    Instructor ✨
      `, 
      html: `
      <p>Hi <b>${studentData.first_name}</b>,</p>
      
      <p>I hope you're doing great! 🌟 This is a friendly reminder to complete your quiz on <b>${quizData.title}</b>. ⏰ The quiz is an important step in reinforcing what you've learned, and I know you'll do amazing! 💪</p>
      
      <h3>📝 <b>Quiz Details:</b></h3>
      <ul>
        <li><b>Topic:</b> ${quizData.title}</li>
        <li><b>Questions:</b> ${quizData.no_of_question}</li>
        <li><b>Duration:</b> ${quizData.time_duration}</li>
      </ul>
      
      <p>Make sure you're prepared, and don't forget to review your notes before starting! 📚 If you have any questions or need help, feel free to reach out! 📨</p>
      
      <p>Good luck! 🍀 I'm rooting for you, and I can't wait to see your results! 🎉</p>
      
      <p>Best regards,<br/>
      ${instructor}<br/>
      <b>Instructor</b> ✨</p>
      `, 
  };

  sendMail.sendMail(userResultId,quizData,transporter, mailOptions, (err, data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while sending the email.",
      });
    } else {
      res.send({
        message: "Email sent successfully!",
        info: data,
      });
    }
  });
};

exports.updateReminderStatus = async (req,res) => {
  const id = req.body.studentId;
  console.log("id:",id)
  sendMail.updateReminderStatus(id,(err,data) => {
    if (err) {
      res.status(500).send({
        message: err.message || "Some error occurred while update.",
      });
    } else {
     
      res.send({
        message: "updated successfully!",
        info: data,
      });
    }
  })
}
