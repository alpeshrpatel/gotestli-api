const cron = require("node-cron");
const {
  getPendingQuestionFiles,
  insertQuestionsFromFile,
  sendNotifyMailToIns,
} = require("../models/cronservice.model");

module.exports = (app) => {
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("Running Cron Job to insert questions...");

      // Fetch question files with status = 0

      getPendingQuestionFiles((err, questionFiles) => {
        if (err) {
          console.error("Error fetching question files:", err);
          return;
        }

        if (questionFiles.length === 0) {
          console.log("No pending question files found.");
          return;
        }
        processQuestionFiles(0, questionFiles);
      });
    } catch (error) {
      console.error("Error running Cron Job:", error);
    }
  });
};

function processQuestionFiles(index, questionFiles) {
  if (index >= questionFiles.length) {
    console.log("Cron Job completed successfully.");
    return;
  }

  const file = questionFiles[index];

  insertQuestionsFromFile(file, (err) => {
    if (err) {
      console.error(`Error processing file ID ${file.id}:`, err);
    }
    sendNotifyMailToIns(file, (err) => {
      if (err) {
        console.error(
          `Error sending mail on upload of file Id ${file.id}:`,
          err
        );
      }
    });

    processQuestionFiles(index + 1, questionFiles);
  });
}
