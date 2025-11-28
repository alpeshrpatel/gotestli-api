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
        console.log(`Processing file ID: ${file.id}`);
        console.log(`insert question File Path: ${file.file_path}`);
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
            // const errorLogJson = JSON.parse(notificationDetails.error_log);
//             const response = await axios.post(
//                 `https://api.communication.gotestli.com/api/send/email`,
//                 {
//                     app_id: APP_ID,
//                     sender: "gotestli07@gmail.com",
//                     sender_name: "Gotestli",
//                     recipients: [
//                         {
//                             email: notificationDetails.email,
//                             name: notificationDetails.first_name,
//                         }
//                     ],
//                     content: {
//                         subject: "📊 Question Upload Report: Excel File Processed Successfully!",
//                         body_text: `
// Hi ${notificationDetails.first_name},

// We’ve completed processing your uploaded Excel file for question insertion. Below is a summary of the results:

// ✔️ **Successful Insertions:**
// - ${(notificationDetails.correct_rows &&
//                                 notificationDetails.correct_rows?.split(",").length) ||
//                             0
//                             } questions were successfully inserted into the database.

// ❌ **Errors During Insertion:**
// - ${(notificationDetails.error_rows &&
//                                 notificationDetails.error_rows?.split(",").length) ||
//                             0
//                             } rows encountered errors. 
//   - Row indexes: ${notificationDetails.error_rows}
//    Detailed Error Log:
// ${notificationDetails.error_log?.map((err, i) => `  ${i + 1}. ${err}`).join("\n") || "  None"}
// Please review the error details and correct the file if necessary. If you need any assistance, feel free to reach out!

// Wishing you success,
// The Gotestli Team

// ---------------------
// Gotestli
// Test Your Limits, Expand Your Knowledge
// https://gotestli.com
// `,
//                         body_html: `
// <p>Hi <b>${notificationDetails.first_name}</b>,</p>

// <p>We’ve completed processing your uploaded Excel file for question insertion. Below is a summary of the results:</p>

// <h3>✔️ <b>Successful Insertions:</b></h3>
// <ul>
//   <li><b>${(notificationDetails.correct_rows &&
//                                 notificationDetails.correct_rows?.split(",").length) ||
//                             0
//                             }</b> questions were successfully inserted into the database.</li>
// </ul>

// <h3>❌ <b>Errors During Insertion:</b></h3>
// <ul>
//   <li><b>${(notificationDetails.error_rows &&
//                                 notificationDetails.error_rows?.split(",").length) ||
//                             0
//                             }</b> rows encountered errors.</li>
//   <li>Row indexes: <b>${notificationDetails.error_rows}</b></li>
// </ul>
// <h4 style="margin-top: 20px;">🛠️ <b>Detailed Error Log:</b></h4>
// <ol style="padding-left: 20px; color: #b00020;">
//   ${notificationDetails.error_log?.map((err, i) => `
//     <li style="margin-bottom: 10px;">
//       <span style="font-weight: bold;">${err.replace(/\(Row:- (\d+)\)/, '<span style="color:#000;">Row  <b>$1</b></span>')}</span>
//     </li>
//   `).join('') || "<li>None</li>"}
// </ol>

// <p>Please review the error details and correct the file if necessary. If you need any assistance, feel free to reach out!</p>

//  <p>Wishing you success,<br/>  
// <p>Gotestli Team</p>
// <hr style="margin: 30px 0;" />

// <div style="font-size: 13px; color: #888; text-align: center;">
//   <img src="https://gotestli.com/assets/img/header-logo3.png" alt="Gotestli Logo" width="120" style="margin-bottom: 10px;" />
//   <p><b>Gotestli</b><br/>
//   Test Your Limits, Expand Your Knowledge<br/>
//   <a href="https://gotestli.com" style="color: #ff6600; text-decoration: none;">www.gotestli.com</a></p>
//   <p style="margin-top: 10px; font-size: 12px;">
   
//     <a href="mailto:gotestli07@gmail.com" style="color: #666; text-decoration: none; margin: 0 5px;">✉️ gotestli07@gmail.com</a>
//   </p>
  
// </div>
// `,
//                     },

//                 },
//                 // {
//                 //   userResultId: studentData.id,
//                 //   studentData: data,
//                 //   quizData: set,
//                 //   instructor: response?.data?.first_name,
//                 // },
//                 {
//                     headers: fastapi_headers
//                 }
//             );
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

// const connection = require("../config/mysql.db.config");
// const { default: axios } = require("axios");
// const generateDateTime = require("../utils/util");

// const APP_ID = 1;
// const API_TOKEN = '7b9e6c5f-8a1d-4d3e-b5f2-c9a8e7d6b5c4';
// const dev_URL = 'http://localhost:3000/api/question/files/insert/questions';
// const prod_URL = 'https://api.gotestli.com/api/question/files/insert/questions';
// const API_URL = process.env.NODE_ENV === 'production' ? prod_URL : dev_URL;

// const fastapi_headers = {
//     "X-API-Token": API_TOKEN,
//     "app-id": APP_ID
// };

// // Get pending question files with detailed logging
// async function getPendingQuestionFiles(result) {
//     try {
//         console.log('Fetching pending question files...');
//         connection.query(`SELECT * from question_files where status = 0`, (err, res) => {
//             if (err) {
//                 console.error('Database error when fetching pending files:', err);
//                 result(err, null);
//                 return;
//             }

//             if (res.length) {
//                 console.log(`Found ${res.length} pending files for processing`);
//                 result(null, res);
//             } else {
//                 console.log('No pending question files found');
//                 result(null, []);
//             }
//         });
//     } catch (error) {
//         console.error('Error fetching pending question files:', error);
//         throw error;
//     }
// }

// // Insert questions from file with better error handling and logging
// async function insertQuestionsFromFile(file, result) {
//     try {
//         console.log(`Started processing file ID: ${file.id}`);
//         console.log(`File path: ${file.file_path}`);
//         const apiUrl = API_URL;

//         console.log(`Sending file to processing API at ${apiUrl}`);
//         const response = await axios.post(apiUrl, {
//             fileId: file.id,
//             filePath: file.file_path,
//             userId: file.user_id
//         });
        
//         console.log(`API response status: ${response.status}`);
//         console.log(`API response data:`, response.data);

//         // Update the status of the file to 1 (processed)
//         const date = generateDateTime();
//         console.log(`Updating file status to processed (1) for file ID: ${file.id}`);
        
//         connection.query(`UPDATE question_files SET status = 1 where id = ${file.id}`, (err, res) => {
//             if (err) {
//                 console.error("Error updating question_files status:", err);
//                 result(err);
//                 return;
//             }
//             console.log(`File ID ${file.id} status updated. Affected rows: ${res.affectedRows}`);
//             result(null);
//         });
//     } catch (error) {
//         console.error(`Error processing file ID: ${file.id}`, error);
//         // Check if we have detailed error information from the API
//         if (error.response) {
//             console.error(`API error status: ${error.response.status}`);
//             console.error(`API error data:`, error.response.data);
//         }
//         result(error);
//     }
// }

// // Send notification email with more detailed logging
// async function sendNotifyMailToIns(file, result) {
//     try {
//         console.log(`Fetching instructor details for file ID: ${file.id}`);
//         connection.query(`
//             select qf.*, u.first_name, u.email 
//             from question_files qf 
//             join users u on u.id = qf.user_id 
//             where qf.id = ${file.id}
//         `, async (err, res) => {
//             if (err) {
//                 console.error("Error retrieving instructor details:", err);
//                 result(err);
//                 return;
//             }
            
//             if (res.length === 0) {
//                 console.error(`No instructor details found for file ID: ${file.id}`);
//                 result(new Error("Instructor details not found"));
//                 return;
//             }
            
//             console.log(`Found instructor details for file ID: ${file.id}`, {
//                 name: res[0].first_name,
//                 email: res[0].email,
//                 file_name: res[0].file_name
//             });
            
//             const notificationDetails = res[0];
            
//             // Log the correct_rows and error_rows values
//             console.log(`File processing results - Success rows: ${notificationDetails.correct_rows || "None"}`);
//             console.log(`File processing results - Error rows: ${notificationDetails.error_rows || "None"}`);
            
//             const successCount = (notificationDetails.correct_rows && 
//                               notificationDetails.correct_rows?.split(",").length) || 0;
                          
//             const errorCount = (notificationDetails.error_rows && 
//                             notificationDetails.error_rows?.split(",").length) || 0;
            
//             console.log(`Sending email to ${notificationDetails.email} with results: ${successCount} successes, ${errorCount} errors`);
            
//             try {
//                 const response = await axios.post(
//                     `https://api.communication.gotestli.com/api/send/email`,
//                     {
//                         app_id: APP_ID,
//                         sender: "gotestli07@gmail.com",
//                         sender_name: "Gotestli",
//                         recipients: [
//                             {
//                                 email: notificationDetails.email,
//                                 name: notificationDetails.first_name,
//                             }
//                         ],
//                         content: {
//                             subject: "📊 Question Upload Report: Excel File Processed Successfully!",
//                             body_text: `
// Hi ${notificationDetails.first_name},

// We've completed processing your uploaded Excel file for question insertion. Below is a summary of the results:

// ✔️ **Successful Insertions:**
// - ${successCount} questions were successfully inserted into the database.

// ❌ **Errors During Insertion:**
// - ${errorCount} rows encountered errors. 
//   - Row indexes: ${notificationDetails.error_rows || "None"}

// Please review the error details and correct the file if necessary. If you need any assistance, feel free to reach out!

// Wishing you success,
// The Gotestli Team

// ---------------------
// Gotestli
// Test Your Limits, Expand Your Knowledge
// https://gotestli.com
// `,
//                             body_html: `
// <p>Hi <b>${notificationDetails.first_name}</b>,</p>

// <p>We've completed processing your uploaded Excel file for question insertion. Below is a summary of the results:</p>

// <h3>✔️ <b>Successful Insertions:</b></h3>
// <ul>
//   <li><b>${successCount}</b> questions were successfully inserted into the database.</li>
// </ul>

// <h3>❌ <b>Errors During Insertion:</b></h3>
// <ul>
//   <li><b>${errorCount}</b> rows encountered errors.</li>
//   <li>Row indexes: <b>${notificationDetails.error_rows || "None"}</b></li>
// </ul>

// <p>Please review the error details and correct the file if necessary. If you need any assistance, feel free to reach out!</p>

// <p>Wishing you success,<br/>  
// <p>Gotestli Team</p>
// <hr style="margin: 30px 0;" />

// <div style="font-size: 13px; color: #888; text-align: center;">
//   <img src="https://gotestli.com/assets/img/header-logo3.png" alt="Gotestli Logo" width="120" style="margin-bottom: 10px;" />
//   <p><b>Gotestli</b><br/>
//   Test Your Limits, Expand Your Knowledge<br/>
//   <a href="https://gotestli.com" style="color: #ff6600; text-decoration: none;">www.gotestli.com</a></p>
//   <p style="margin-top: 10px; font-size: 12px;">
   
//     <a href="mailto:gotestli07@gmail.com" style="color: #666; text-decoration: none; margin: 0 5px;">✉️ gotestli07@gmail.com</a>
//   </p>
  
// </div>
// `,
//                         },
//                     },
//                     {
//                         headers: fastapi_headers
//                     }
//                 );
                
//                 console.log(`Email notification sent successfully.`);
//                 result(null);
//             } catch (emailError) {
//                 console.error(`Error sending email notification:`, emailError);
//                 if (emailError.response) {
//                     console.error(`Email API error status: ${emailError.response.status}`);
//                     console.error(`Email API error data:`, emailError.response.data);
//                 }
//                 result(emailError);
//             }
//         });
//     } catch (error) {
//         console.error(`Unexpected error in sendNotifyMailToIns:`, error);
//         result(error);
//     }
// }

// module.exports = {
//     getPendingQuestionFiles,
//     insertQuestionsFromFile,
//     sendNotifyMailToIns
// };