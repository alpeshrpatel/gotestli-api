const QuestionFiles = require("../models/questionfiles.model");
const generateDateTime = require("../utils/util");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");

// Create and Save a new QuestionFiles
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  const createdDate = generateDateTime();
  // Save QuestionFiles in the database
  QuestionFiles.create(req.body, createdDate, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the QuestionFiles.",
      });
    else res.send(data);
  });
};

// insert questions into question_master and question_options
exports.insertQuestions = async (req, res) => {
  const filePath = req.body.filePath;
  const userId = req.body.userId;
  const date = generateDateTime();
  
  let dataSet = {};
  console.log("filepaTh: ", filePath);
  const readExcelFile = async (filePath) => {
    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.readFile(filePath);

      const worksheet = workbook.getWorksheet("Questions Data"); // Or workbook.getWorksheet('SheetName') for a specific sheet
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 7) {
          const rowData = [];
          console.log(`Row ${rowNumber}:`);
          row.eachCell((cell, colNumber) => {
            console.log(`Column ${colNumber}: ${cell.value}`);
            rowData.push(cell.value);
          });
         dataSet = {...dataSet, [rowNumber] : rowData};
        }
      });
    } catch (error) {
      console.error("Error reading the Excel file:", error);
    }
    console.log("DATA SET: ", dataSet);
  };
  try {
    await readExcelFile(filePath);

  QuestionFiles.insertQuestions(dataSet, userId, date, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({ message: "Data not found" });
      } else {
        res.status(500).send({ message: "Error inserting questions data" });
      }
    } else {
      res.send(data); // Send the inserted data response (including IDs)
    }
  });
  } catch (error) {
    res.status(500).send({ message: "Failed to process the Excel file." });
  }
  
};

exports.getSampleFile = (req, res) => {
  const filePath = path.join(
    __dirname,
    "../../gotestli-web/client/public/samplefile/Project-Management-Sample-Data.xlsx"
  );
  res.download(filePath, "Project-Management-Sample-Data.xlsx", (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send({
        message: "Error downloading the file",
      });
    }
  });
};

exports.findById = (req, res) => {
  QuestionFiles.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found user with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with id " + req.params.id,
        });
      }
    } else res.send(data);
  });
};

// updateById

// Delete all FollowersLists from the database.
exports.deleteAll = (req, res) => {
  QuestionFiles.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while removing all FollowersLists.",
      });
    else res.send({ message: `All FollowersLists were deleted successfully!` });
  });
};
