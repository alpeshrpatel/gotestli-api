// const cron = require("node-cron");
// const {
//   getPendingQuestionFiles,
//   insertQuestionsFromFile,
//   sendNotifyMailToIns,
// } = require("../models/cronservice.model");

const cronService = require("./cronservice");

// module.exports = (app) => {

//   cron.schedule("*/2 * * * *", async () => {
//     console.log("Cron Job started");
//     try {
//       //  // console.log("Running Cron Job to insert questions...");

//       // Fetch question files with status = 0

//       getPendingQuestionFiles((err, questionFiles) => {
//         if (err) {
//           console.error("Error fetching question files:", err);
//           return;
//         }

//         if (questionFiles.length === 0) {

//           return;
//         }
//         processQuestionFiles(0, questionFiles);
//       });
//     } catch (error) {
//       console.error("Error running Cron Job:", error);
//     }
//   });
// };

// function processQuestionFiles(index, questionFiles) {
//   if (index >= questionFiles.length) {

//     return;
//   }

//   const file = questionFiles[index];

//   insertQuestionsFromFile(file, (err) => {
//     if (err) {
//       console.error(`Error processing file ID ${file.id}:`, err);
//     }
//     console.log('sending notification email to instructor');
//     sendNotifyMailToIns(file, (err) => {
//       if (err) {
//         console.error(
//           `Error sending mail on upload of file Id ${file.id}:`,
//           err
//         );
//       }
//     });
//     console.log('notification email sent') 

//     processQuestionFiles(index + 1, questionFiles);
//   });
// }




// Improved cron.js implementation with proper async handling
// const cron = require("node-cron");
// const {
//   getPendingQuestionFiles,
//   insertQuestionsFromFile,
//   sendNotifyMailToIns,
// } = require("../models/cronservice.model");

// const cronService = {};
// // module.exports = (app) => {
//   exports.startCronJob = (req, res) => {
//   try {
//     cron.startCronJob();
//     res.status(200).send({
//       message: "Cron job started successfully"
//     });
//   } catch (error) {
//     console.error("Error starting cron job:", error);
//     res.status(500).send({
//       message: "Failed to start cron job",
//       error: error.message
//     });
//   }
// };
  

//   cronService.startCronJob = () => {
//     cron.schedule("* * * * *", async () => {
//       console.log("=====================================================");
//       console.log("Cron Job started at", new Date().toISOString());

//       try {
//         // Fetch question files with status = 0
//         getPendingQuestionFiles(async (err, questionFiles) => {
//           if (err) {
//             console.error("Error fetching question files:", err);
//             return;
//           }

//           if (questionFiles.length === 0) {
//             console.log("No pending question files found");
//             return;
//           }

//           console.log(`Found ${questionFiles.length} pending question files to process`);
//           // Process files one by one
//           await processQuestionFiles(0, questionFiles);
//           console.log("Cron job completed successfully");
//           console.log("=====================================================");
//           res.status(200).send({
//             message: "Cron job started successfully"
//           });
//         });
//       } catch (error) {
//         console.error("Error running Cron Job:", error);
//         console.log("=====================================================");
//         console.error("Error starting cron job:", error);
//         res.status(500).send({
//           message: "Failed to start cron job",
//           error: error.message
//         });
//       }
//     });
//   }



// // Process files sequentially with proper async/await handling
// async function processQuestionFiles(index, questionFiles) {
//   // Base case: all files processed
//   if (index >= questionFiles.length) {
//     console.log("All files processed successfully");
//     return;
//   }

//   const file = questionFiles[index];
//   console.log(`Processing file ${index + 1}/${questionFiles.length}: ID=${file.id}, Name=${file.file_name}`);

//   try {
//     // Step 1: Process the file and insert questions
//     await new Promise((resolve, reject) => {
//       insertQuestionsFromFile(file, (err) => {
//         if (err) {
//           console.error(`Error processing file ID ${file.id}:`, err);
//           reject(err);
//         } else {
//           console.log(`Successfully processed file ID ${file.id}`);
//           resolve();
//         }
//       });
//     });

//     // Step 2: Send notification email
//     console.log('Sending notification email to instructor for file ID:', file.id);
//     await new Promise((resolve, reject) => {
//       sendNotifyMailToIns(file, (err) => {
//         if (err) {
//           console.error(`Error sending notification for file ID ${file.id}:`, err);
//           reject(err);
//         } else {
//           console.log(`Notification email sent for file ID ${file.id}`);
//           resolve();
//         }
//       });
//     });

//     // Step 3: Process next file
//     console.log(`Completed processing file ID ${file.id}, moving to next file`);
//     await processQuestionFiles(index + 1, questionFiles);
//   } catch (error) {
//     console.error(`Error in file processing pipeline for file ID ${file.id}:`, error);
//     // Continue with next file even if there was an error with this one
//     console.log(`Moving to next file despite error with file ID ${file.id}`);
//     await processQuestionFiles(index + 1, questionFiles);
//   }
// }

// module.exports = cronService;




// Controller for starting the cron job
exports.startCronJob = (req, res) => {
  try {
    cronService.startCronJob();
    res.status(200).send({
      message: "Cron job started successfully"
    });
  } catch (error) {
    console.error("Error starting cron job:", error);
    res.status(500).send({
      message: "Failed to start cron job",
      error: error.message
    });
  }
};