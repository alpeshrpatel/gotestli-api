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

//getOrganizationOnboarding
exports.getOrganizationOnboarding = async (req, res) => {
  const { orgName, email, password, subdomain } = req.body;

  const mailOptionsForOrgOnboarding = {
    from: {
      name: "Gotestli",
      address: process.env.USER,
    }, // sender address
    to: email, // recipient email
    subject: `🎉 Welcome Aboard GoTestli! Your Organization is Now Approved ✅`,
    text: `
Dear Partner,
Fantastic news! 🚀 Your organization ${orgName} has been officially approved for onboarding to the GoTestli platform. We're thrilled to welcome you to our community of innovative educators and learners!
Your dedicated admin portal is now active and ready for you to explore. Here are your credentials to get started:
🔐 ADMIN LOGIN DETAILS:
URL: https://${subdomain}.gotestli.com
Username: ${email}
Temporary Password: ${password} (Please change upon first login)
With GoTestli, you now have access to:

📊 Comprehensive assessment creation tools
📈 Real-time analytics and performance tracking
🔄 Seamless content integration capabilities
👥 User management and permission controls
🎓 Extensive quiz and learning resources library

We've scheduled a personalized onboarding session for your team on Wednesday, March 12th at 10:00 AM EST. Our implementation specialist will guide you through platform setup and answer any questions you may have.
In the meantime, feel free to explore our Getting Started Guide (https://help.gotestli.com/getting-started) and Resource Center (https://help.gotestli.com/resources).
We're excited to see the engaging learning experiences you'll create with GoTestli!
Welcome aboard,
The GoTestli Team
Need assistance? Contact our support team at support@gotestli.com or call (800) 555-TEST.
  `,
    html: `
<p>Dear Partner,</p>
<p>Fantastic news! 🚀 Your organization <b>${orgName}</b> has been <b>officially approved</b> for onboarding to the GoTestli platform. We're thrilled to welcome you to our community of innovative educators and learners!</p>
<p>Your dedicated admin portal is now <b>active and ready</b> for you to explore. Here are your credentials to get started:</p>
<div style="background-color: #f8f9fa; border-left: 4px solid #4CAF50; padding: 15px; margin: 20px 0;">
  <p><b>🔐 Admin Login Details:</b></p>
  <p>URL: <a href="https://${subdomain}.gotestli.com">https://${subdomain}.gotestli.com</a><br>
  Username: <b>${email}</b><br>
  Temporary Password: <b>${password}</b> (Please change upon first login)</p>
</div>
<p>With GoTestli, you now have access to:</p>
<ul>
  <li>📊 Comprehensive assessment creation tools</li>
  <li>📈 Real-time analytics and performance tracking</li>
  <li>🔄 Seamless content integration capabilities</li>
  <li>👥 User management and permission controls</li>
  <li>🎓 Extensive quiz and learning resources library</li>
</ul>

<p>We're excited to see the engaging learning experiences you'll create with GoTestli!</p>
<p>Welcome aboard,<br>
<b>The GoTestli Team</b></p>
<p style="font-size: 12px; color: #666;">
Need assistance? Contact our support team at <a href="mailto:gotestli07@gmail.com">gotestli07@gmail.com</a> or call (800) 555-TEST.
</p>
  `,
  };

  sendMail.sendNotifyMail(
    transporter,
    mailOptionsForOrgOnboarding,
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

//getUserInvitation
exports.getUserInvitation = async (req, res) => {
  const { orgName, email, password, subdomain, role } = req.body;

  const mailOptionsForUserInvitation = {
    from: {
      name: "Gotestli",
      address: process.env.USER,
    }, // sender address
    to: email, // recipient email
    subject: `🎊 Welcome to GoTestli! Your Organization Access is Ready 🚀`,
    text: 
`Dear ${role === 'instructor' ? 'Instructor' : 'Student'},

We’re excited to welcome you to GoTestli! Your organization, ${orgName}, is now onboarded, and your access has been set up. You’re just a step away from unlocking powerful tools designed to enhance learning and assessments.

Here are your login details:

🔑 Login Credentials  
🔗 Platform URL: https://${subdomain}.gotestli.com  
📧 Username: ${email}  
🔒 Temporary Password: ${password} (Please change upon first login)  

As a ${role}, you will have access to:

${role === 'instructor'  
  ? `- 📚 Create and manage interactive assessments  
  - 📊 Track student progress with real-time analytics  
  - 🔄 Integrate learning content effortlessly  
  - 🏫 Oversee student participation and performance`  
  : `- 📝 Access engaging quizzes and assessments  
  - 📈 Monitor your progress and performance  
  - 🎯 Enhance learning with personalized content  
  - 🎓 Stay on top of your academic journey`}  

💡 **Next Steps:**  
📅 Join us for a live onboarding session on **Wednesday, March 12th at 10:00 AM EST**, where our specialists will guide you through the platform.  

In the meantime, check out our **Getting Started Guide** (https://help.gotestli.com/getting-started) and **Resource Center** (https://help.gotestli.com/resources) to familiarize yourself with GoTestli.  

We’re thrilled to have you on board and can’t wait to see you excel!  

**Best Regards,**  
🚀 The GoTestli Team  

📩 Need help? Reach out to us at **gotestli07@gmail.com** or call **(800) 555-TEST**.  
  `,
    html: `
<p>Dear <strong>${role === 'instructor' ? 'Instructor' : 'Student'}</strong>,</p>

<p>We’re excited to welcome you to <strong>GoTestli</strong>! Your organization, <strong>${orgName}</strong>, is now onboarded, and your access has been set up. You’re just a step away from unlocking powerful tools designed to enhance learning and assessments.</p>

<div style="background-color: #f8f9fa; border-left: 5px solid #4CAF50; padding: 15px; margin: 20px 0;">
  <p><strong>🔑 Login Credentials</strong></p>
  <p>🔗 <strong>Platform URL:</strong> <a href="https://${subdomain}.gotestli.com" style="color: #007BFF;">https://${subdomain}.gotestli.com</a></p>
  <p>📧 <strong>Username:</strong> ${email}</p>
  <p>🔒 <strong>Temporary Password:</strong> <strong>${password}</strong> (Please change upon first login)</p>
</div>

<p>As a <strong>${role}</strong>, you will have access to:</p>

${role === 'instructor'  
  ? `<ul>
       <li>📚 Create and manage interactive assessments</li>
       <li>📊 Track student progress with real-time analytics</li>
       <li>🔄 Integrate learning content effortlessly</li>
       <li>🏫 Oversee student participation and performance</li>
     </ul>`  
  : `<ul>
       <li>📝 Access engaging quizzes and assessments</li>
       <li>📈 Monitor your progress and performance</li>
       <li>🎯 Enhance learning with personalized content</li>
       <li>🎓 Stay on top of your academic journey</li>
     </ul>`}


<p>We’re thrilled to have you on board and can’t wait to see you excel!</p>

<p><strong>Best Regards,</strong><br>
🚀 <strong>The GoTestli Team</strong></p>

<p style="font-size: 12px; color: #666;">
📩 Need help? Reach out to us at <a href="mailto:gotestli07@gmail.com" style="color: #007BFF;">gotestli07@gmail.com</a> or call (800) 555-TEST.
</p>

  `,
  };

  sendMail.sendNotifyMail(
    transporter,
    mailOptionsForUserInvitation,
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