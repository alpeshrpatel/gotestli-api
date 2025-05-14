const { default: axios } = require("axios");
const connection = require("../config/mysql.db.config");
const generateDateTime = require("../utils/util");

const APP_ID = 1;
const API_TOKEN = '7b9e6c5f-8a1d-4d3e-b5f2-c9a8e7d6b5c4';
const dev_URL = 'http://localhost:3000/api/question/files/insert/questions';
const prod_URL = 'https://api.gotestli.com/api/question/files/insert/questions';
const API_URL = process.env.NODE_ENV === 'production' ? prod_URL : dev_URL;


const fastapi_headers = {
    "X-API-Token": API_TOKEN,
    "app-id": APP_ID
};

async function getPendingQuestionFiles(result) {
    try {
        connection.query(`SELECT * from question_files where status = 0`, (err, res) => {
            if (err) {

                result(err, null);
                return;
            }

            if (res.length) {
                result(null, res);
            } else {
                result(null, []);
            }
        })
    } catch (error) {
        console.error('Error fetching pending question files:', error);
        throw error;
    }
}
async function insertQuestionsFromFile(file, result) {
    try {
        const apiUrl = API_URL;

        const response = await axios.post(apiUrl, {
            fileId: file.id,
            filePath: file.file_path,
            userId: file.user_id
        });
        // console.log(response)
        // console.log(`Successfully inserted questions for file ID: ${file.id}`);

        // Update the status of the file to 1 (processed)
        const date = generateDateTime()
        connection.query(`UPDATE question_files SET status = 1 where id = ${file.id}`, (err, res) => {
            if (err) {
                console.error("Error updating status:", err);
                result(err);
                return;
            }
            // console.log(`File ID ${file.id} status updated to processed`);

            result(null);
        })
    } catch (error) {
        console.error(`Error inserting questions for file ID: ${file.id}`, error);
        result(error);
    }
}

async function sendNotifyMailToIns(file, result) {
    connection.query(` select qf.*,u.first_name,u.email from question_files qf join users u on u.id = qf.user_id where qf.id =${file.id};
 `, async (err, res) => {
        if (err) {
            console.error("Error retriving details:", err);
            result(err);
            return;
        }
        // console.log(`File ID ${file.id} instructor details retrieved`);
        if (res.length > 0) {
            // const apiUrl = "http://localhost:3000/api/sendemail/instructor/uploadfile/result";
            // const response = await axios.post(apiUrl,{notificationDetails:res[0]});
            console.log('notify response', res);
            const notificationDetails = res[0];
            const response = await axios.post(
                `https://api.communication.gotestli.com/api/send/email`,
                {
                    app_id: APP_ID,
                    sender: "gotestli07@gmail.com",
                    sender_name: "Gotestli",
                    recipients: [
                        {
                            email: notificationDetails.email,
                            name: notificationDetails.first_name,
                        }
                    ],
                    content: {
                        subject: "📊 Question Upload Report: Excel File Processed Successfully!",
                        body_text: `
Hi ${notificationDetails.first_name},

We’ve completed processing your uploaded Excel file for question insertion. Below is a summary of the results:

✔️ **Successful Insertions:**
- ${(notificationDetails.correct_rows &&
                                notificationDetails.correct_rows?.split(",").length) ||
                            0
                            } questions were successfully inserted into the database.

❌ **Errors During Insertion:**
- ${(notificationDetails.error_rows &&
                                notificationDetails.error_rows?.split(",").length) ||
                            0
                            } rows encountered errors. 
  - Row indexes: ${notificationDetails.error_rows}

Please review the error details and correct the file if necessary. If you need any assistance, feel free to reach out!

Wishing you success,
The GoTestLI Team

---------------------
GoTestli
Test Your Limits, Expand Your Knowledge
https://gotestli.com
`,
                        body_html: `
<p>Hi <b>${notificationDetails.first_name}</b>,</p>

<p>We’ve completed processing your uploaded Excel file for question insertion. Below is a summary of the results:</p>

<h3>✔️ <b>Successful Insertions:</b></h3>
<ul>
  <li><b>${(notificationDetails.correct_rows &&
                                notificationDetails.correct_rows?.split(",").length) ||
                            0
                            }</b> questions were successfully inserted into the database.</li>
</ul>

<h3>❌ <b>Errors During Insertion:</b></h3>
<ul>
  <li><b>${(notificationDetails.error_rows &&
                                notificationDetails.error_rows?.split(",").length) ||
                            0
                            }</b> rows encountered errors.</li>
  <li>Row indexes: <b>${notificationDetails.error_rows}</b></li>
</ul>

<p>Please review the error details and correct the file if necessary. If you need any assistance, feel free to reach out!</p>

 <p>Wishing you success,<br/>  
<p>GoTestli Team</p>
<hr style="margin: 30px 0;" />

<div style="font-size: 13px; color: #888; text-align: center;">
  <img src="https://gotestli.com/assets/img/header-logo3.png" alt="GoTestLI Logo" width="120" style="margin-bottom: 10px;" />
  <p><b>GoTestli</b><br/>
  Test Your Limits, Expand Your Knowledge<br/>
  <a href="https://gotestli.com" style="color: #ff6600; text-decoration: none;">www.gotestli.com</a></p>
  <p style="margin-top: 10px; font-size: 12px;">
   
    <a href="mailto:gotestli07@gmail.com" style="color: #666; text-decoration: none; margin: 0 5px;">✉️ gotestli07@gmail.com</a>
  </p>
  
</div>
`,
                    },

                },
                // {
                //   userResultId: studentData.id,
                //   studentData: data,
                //   quizData: set,
                //   instructor: response?.data?.first_name,
                // },
                {
                    headers: fastapi_headers
                }
            );
            // console.log(response)
        }
        result(null);
    })
}

module.exports = {
    getPendingQuestionFiles,
    insertQuestionsFromFile,
    sendNotifyMailToIns
};