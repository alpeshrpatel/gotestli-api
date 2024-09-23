const QuestionFiles = require("../models/questionfiles.model");
const generateDateTime = require("../utils/util");
const ExcelJS = require('exceljs');
const path = require('path');

// Create and Save a new QuestionFiles
exports.create = (req, res) => {
      // Validate request
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }

      const createdDate = generateDateTime();
      // Save QuestionFiles in the database
      QuestionFiles.create(req.body, createdDate , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the QuestionFiles."
          });
        else res.send(data);
      });
};

// insert questions into question_master and question_options
exports.insertQuestions = (req,res) => {
    const filePath = req.body.filePath;
    console.log("filepaTh: ",filePath)
    const readExcelFile = async (filePath) => {
     
        const workbook = new ExcelJS.Workbook();
        
        try {
     
          await workbook.xlsx.readFile(filePath);

          const worksheet = workbook.worksheets[0]; // Or workbook.getWorksheet('SheetName') for a specific sheet
 
          worksheet.eachRow((row, rowNumber) => {
            console.log(`Row ${rowNumber}:`);
            row.eachCell((cell, colNumber) => {
              console.log(`Column ${colNumber}: ${cell.value}`);
            });
          });
        } catch (error) {
          console.error('Error reading the Excel file:', error);
        }
      };
      
    
      readExcelFile(filePath);

      QuestionFiles.insertQuestions(req.body, (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.send({
              message: `Not found user with id ${req.params.id}.`
            });
          } else {
            res.status(500).send({
              message: "Error retrieving user with id " + req.params.id
            });
          }
        } else res.send(data);
      });
}

exports.findById =  (req, res) => {
    QuestionFiles.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.send({
            message: `Not found user with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving user with id " + req.params.id
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
          err.message || "Some error occurred while removing all FollowersLists."
      });
    else res.send({ message: `All FollowersLists were deleted successfully!` });
  });
};
