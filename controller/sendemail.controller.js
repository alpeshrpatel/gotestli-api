const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const sendMail = require("../models/sendemail.model");
const connection = require("../config/mysql.db.config");
const ForgotPasswordOtp = require("../models/forgotpasswordotp.model");

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for port 465, false for other ports
  auth: {
    user: process.env.USER,
    pass: process.env.GOOGLE_APP_PASSWORD,
  },
});

exports.sendReminder = async (req, res) => {
  const { userResultId, studentData, quizData, instructor } = req.body;

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

  sendMail.sendMail(
    userResultId,
    quizData,
    transporter,
    mailOptions,
    (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while sending the email.",
        });
      } else {
        res.send({
          message: "Email sent successfully!",
          info: data,
        });
      }
    }
  );
};

exports.updateReminderStatus = async (req, res) => {
  const id = req.body.studentId;

  sendMail.updateReminderStatus(id, (err, data) => {
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
  });
};

exports.sendNotifyMailToInsructor = async (req, res) => {
  const { notificationDetails } = req.body;
  const mailOptionsToNotifyInstructor = {
    from: {
      name: "Gotestli",
      address: process.env.USER,
    }, // sender address
    to: notificationDetails.email,
    subject: "📊 Question Upload Report: Excel File Processed Successfully!",
    text: `
Hi ${notificationDetails.first_name},

We’ve completed processing your uploaded Excel file for question insertion. Below is a summary of the results:

✔️ **Successful Insertions:**
- ${
      (notificationDetails.correct_rows &&
        notificationDetails.correct_rows?.split(",").length) ||
      0
    } questions were successfully inserted into the database.

❌ **Errors During Insertion:**
- ${
      (notificationDetails.error_rows &&
        notificationDetails.error_rows?.split(",").length) ||
      0
    } rows encountered errors. 
  - Row indexes: ${notificationDetails.error_rows}

Please review the error details and correct the file if necessary. If you need any assistance, feel free to reach out!

Best regards,
Your Team
`,
    html: `
<p>Hi <b>${notificationDetails.first_name}</b>,</p>

<p>We’ve completed processing your uploaded Excel file for question insertion. Below is a summary of the results:</p>

<h3>✔️ <b>Successful Insertions:</b></h3>
<ul>
  <li><b>${
    (notificationDetails.correct_rows &&
      notificationDetails.correct_rows?.split(",").length) ||
    0
  }</b> questions were successfully inserted into the database.</li>
</ul>

<h3>❌ <b>Errors During Insertion:</b></h3>
<ul>
  <li><b>${
    (notificationDetails.error_rows &&
      notificationDetails.error_rows?.split(",").length) ||
    0
  }</b> rows encountered errors.</li>
  <li>Row indexes: <b>${notificationDetails.error_rows}</b></li>
</ul>

<p>Please review the error details and correct the file if necessary. If you need any assistance, feel free to reach out!</p>

<p>Best regards,<br/>
Team Gotestli</p>
`,
  };

  sendMail.sendNotifyMail(
    transporter,
    mailOptionsToNotifyInstructor,
    (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while sending the email.",
        });
      } else {
        res.send({
          message: "Email sent successfully!",
          info: data,
        });
      }
    }
  );
};

exports.getInTouchSubscribedMail = async (req, res) => {
  const { email } = req.body;

  const mailOptionsForGetInTouch = {
    from: {
      name: "Gotestli",
      address: process.env.USER,
    }, // sender address
    to: email, // recipient email
    subject: "Welcome to Gotestli! 🎉 Stay Tuned for Updates!",
    text: `
  Hi there,
  
  Thank you for joining the Gotestli community! 🎉
  
  We're excited to have you on board. By signing up, you'll be the first to know about new releases, exciting features, and exclusive bonuses we have in store just for you. 🚀
  
  Here’s what you can look forward to:
  - 🆕 Early access to new features
  - 🎁 Special giveaways and bonuses
  - 📊 Updates on the latest quizzes and question sets
  
  Stay tuned, and keep an eye on your inbox for some great surprises!
  
  Best regards,
  Team Gotestli
  `,
    html: `
  <p>Hi <b>there</b>,</p>
  
  <p>Thank you for joining the Gotestli community! 🎉</p>
  
  <p>We’re excited to have you with us. By signing up, you'll be the first to know about:</p>
  <ul>
    <li>🆕 Early access to new features</li>
    <li>🎁 Special giveaways and bonuses</li>
    <li>📊 Updates on the latest quizzes and question sets</li>
  </ul>
  
  <p>Stay tuned and keep an eye on your inbox for some amazing updates!</p>
  
  <p>Best regards,<br/>
  Team Gotestli</p>
  `,
  };

  sendMail.sendNotifyMail(
    transporter,
    mailOptionsForGetInTouch,
    (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while sending the email.",
        });
      } else {
        res.send({
          message: "Email sent successfully!",
          info: data,
        });
      }
    }
  );
};

exports.sendUpdateToFollowers = async (req, res) => {
  const { username, email, instructor, title } = req.body;

  const mailOptionsForSendUpdate = {
    from: {
      name: "Gotestli",
      address: process.env.USER,
    }, // sender address
    to: email, // recipient email
    subject: `📢 New Quiz Alert from ${instructor}! 🚀 Check it Out Now!`,
    text: `
Hi ${username},

Great news! ${instructor} just released a brand new quiz: "${title}" on Gotestli, and you're invited to be one of the first to check it out. 🎉

By staying updated, you get:
- 🌟 Exclusive access to fresh quizzes
- 📈 A chance to improve your knowledge and skills
- 🎯 Opportunities to engage and learn with other members of the Gotestli community

Don't miss out on the fun and the learning. Dive into the latest quiz now and see how well you can do!

Happy learning,
Team Gotestli
  `,
    html: `
<p>Hi <b>${username}</b>,</p>

<p>Great news! <b>${instructor}</b> just released a brand new quiz: "<b>${title}</b>" on Gotestli, and you're invited to be one of the first to check it out. 🎉</p>

<p>By staying updated, you get:</p>
<ul>
  <li>🌟 Exclusive access to fresh quizzes</li>
  <li>📈 A chance to improve your knowledge and skills</li>
  <li>🎯 Opportunities to engage and learn with other members of the Gotestli community</li>
</ul>

<p>Don't miss out on the fun and the learning. Dive into the latest quiz now and see how well you can do!</p>

<p>Happy learning,<br/>
Team Gotestli</p>
  `,
  };

  sendMail.sendNotifyMail(
    transporter,
    mailOptionsForSendUpdate,
    (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while sending the email.",
        });
      } else {
        res.send({
          message: "Email sent successfully!",
          info: data,
        });
      }
    }
  );
};

exports.sendOtpMail = async (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000);
  const mailOptionsForSendOtp = {
    from: {
      name: "Gotestli",
      address: process.env.USER,
    }, // sender address
    to: email, // recipient email
    subject: "🔐 Your Verification Code",
    text: `
        Hi User,

        Thank you for signing up! To complete your verification, please use the One-Time Password (OTP) below:

        🔑 Your OTP: ${otp}

        Please enter this code on the verification page. The OTP is valid for the next 10 minutes, so make sure to complete your verification promptly.

        If you did not request this, please ignore this email. For any assistance, feel free to contact our support team.

        Best regards,
        Team Gotestli
      `,
    html: `
        <p>Hi <b>User</b>,</p>
        <p>Thank you for signing up! To complete your verification, please use the One-Time Password (OTP) below:</p>
        <h3>🔑 Your OTP: <b>${otp}</b></h3>
        <p>Please enter this code on the verification page. The OTP is valid for the next <b>10 minutes</b>, so make sure to complete your verification promptly.</p>
        <p>If you did not request this, please ignore this email. For any assistance, feel free to contact our support team.</p>
        <p>Best regards,<br/><b>Team Gotestli</b></p>
      `,
  };
  const saltRounds = 10;
  const hashedOtp = await bcrypt.hash(otp.toString(), saltRounds);
  ForgotPasswordOtp.insertGeneratedOtp(email, hashedOtp, (err, data) => {
    console.log(err);
    if (!err) {
      sendMail.sendNotifyMail(
        transporter,
        mailOptionsForSendOtp,
        (err, data) => {
          if (err) {
            res.status(500).send({
              message:
                err.message || "Some error occurred while sending the email.",
            });
          } else {
            res.send({
              message: "Email sent successfully!",
              info: data,
            });
          }
        }
      );
    } else {
      res.status(500).send({
        message: "OTP Save Fail!",
      });
    }
  });
};

exports.getInTouchForHeerRealtor = async (req, res) => {
  const { email } = req.body;

  const mailOptionsForGetInTouchHeerRealtor = {
    from: {
      name: "Gotestli",
      address: process.env.USER,
    }, // sender address
    to: email, // recipient email
    subject: "Welcome to HeerRealtor! 🏡 Your Dream Home Awaits!",
    text: `
  Hi there,  

Thank you for connecting with HeerRealtor! 🌟  

We’re thrilled to have you on board and are here to help you find the perfect property. Whether you're buying, selling, or investing, we've got exclusive listings, expert insights, and personalized guidance just for you.  

Here's what you can expect:  
- 🏡 Access to premium property listings  
- 📈 Market updates and real estate trends  
- 🤝 Personalized assistance from our expert team  

Stay tuned for the latest listings and updates. If you have any questions, feel free to reach out—we’re happy to help!  

Best regards,  
Team HeerRealtor`,
    html: `
  <p>Hi <b>there</b>,</p>  

<p>Thank you for connecting with <b>HeerRealtor</b>! 🌟</p>  

<p>We’re thrilled to have you on board and are here to help you find the perfect property. Whether you're buying, selling, or investing, we’ve got exclusive listings, expert insights, and personalized guidance just for you.</p>  

<p>Here's what you can expect:</p>  
<ul>  
  <li>🏡 Access to premium property listings</li>  
  <li>📈 Market updates and real estate trends</li>  
  <li>🤝 Personalized assistance from our expert team</li>  
</ul>  

<p>Stay tuned for the latest listings and updates. If you have any questions, feel free to reach out—we’re happy to help!</p>  

<p>Best regards,<br/>  
<b>Team HeerRealtor</b></p>  
  `,
  };

  sendMail.sendNotifyMail(
    transporter,
    mailOptionsForGetInTouchHeerRealtor,
    (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while sending the email.",
        });
      } else {
        res.send({
          message: "Email sent successfully!",
          info: data,
        });
      }
    }
  );
};
