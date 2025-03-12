const { default: axios } = require("axios");
const connection = require("../config/mysql.db.config");
const generateDateTime = require("../utils/util");

async function getPendingQuestionFiles(result) {
    try {
       connection.query(`SELECT * from question_files where status = 0`,(err,res) => {
        if (err) {
             
            result(err, null);
            return;
          }
    
          if (res.length) {
            result(null, res);
          }else {
            result(null, []); 
          }
       })
    } catch (error) {
        console.error('Error fetching pending question files:', error);
        throw error;
    }
}
async function insertQuestionsFromFile(file,result) {
    try {
        const apiUrl = 'http://localhost:3000/api/question/files/insert/questions'; 

        const response = await axios.post(apiUrl, {
            fileId: file.id, 
            filePath: file.file_path,
            userId:file.user_id
        });
         // console.log(response)
         // console.log(`Successfully inserted questions for file ID: ${file.id}`);

        // Update the status of the file to 1 (processed)
        const date = generateDateTime()
        connection.query(`UPDATE question_files SET status = 1 where id = ${file.id}`, (err,res) => {
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

async function sendNotifyMailToIns(file,result){
    connection.query(` select qf.*,u.first_name,u.email from question_files qf join users u on u.id = qf.user_id where qf.id =${file.id};
 `, async (err,res) => {
        if (err) {
            console.error("Error retriving details:", err);
            result(err); 
            return;
        }
         // console.log(`File ID ${file.id} instructor details retrieved`);
        if(res.length > 0){
            const apiUrl = "http://localhost:3000/api/sendemail/instructor/uploadfile/result";
            const response = await axios.post(apiUrl,{notificationDetails:res[0]});
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