const connection = require("../config/mysql.db.config");

const sendMail = async (userResultId,quizData, transporter, mailOptions, result) => {
  try {
    
    console.log("quizData.id:", quizData.id);
    connection.query(
      `UPDATE user_test_result SET last_click_timestamp = ?, btn_disabled = 1 WHERE id = ?`,
      [Date.now(), userResultId],
      async (err, res) => {
        if (err) {
          console.log("Error setting timestamp: ", err);
          result(err, null);
          return;
        }

      
        if (res.affectedRows > 0) {
          console.log("Update successful:", res);

          try {
            let info = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully!");
            result(null, { msg: 'Email sent successfully!', info });
          } catch (emailError) {
            console.error("Error while sending email:", emailError);
            result(emailError, null);
          }
        } else {
          console.log("No rows were updated.");
          result(new Error("No rows updated."), null);
        }
      }
    );
  } catch (error) {
    console.error("Error in sendMail function:", error);
    result(error, null);
  }
};
  const updateReminderStatus = async (id,result) => {
    console.log(id)
    try {
      connection.query(`UPDATE user_test_result SET last_click_timestamp = null,btn_disabled = 0 WHERE id = ?`,id,(err,res)=>{
        if (err) {
          console.log("error in set timestamp: ", err);
          result(err, null);
          return;
        }
        if (res.affectedRows > 0) {
          console.log("updated user_test_result: ", res[0]);
          result(null, res[0]);
          return;
        }
      })
    } catch (error) {
      console.error("Error while supdating user_test_result:", error);
      result(error, null);
    }
  }

  const sendNotifyMail = async(transporter, mailOptions, result) => {
    try {
      let info = await transporter.sendMail(mailOptions);
      console.log("Email sent successfully!");
      result(null, { msg: 'Email sent successfully!', info });
    } catch (emailError) {
      console.error("Error while sending email:", emailError);
      result(emailError, null);
    }
  }
  
  module.exports = {
    sendMail,
    updateReminderStatus,
    sendNotifyMail
  };