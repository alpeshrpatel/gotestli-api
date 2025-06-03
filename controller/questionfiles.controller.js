const QuestionFiles = require("../models/questionfiles.model");
const generateDateTime = require("../utils/util");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const { cache } = require("../middleware/cacheMiddleware");
const { error } = require("console");

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
  const fileId = req.body.fileId;
  const filePath = req.body.filePath;
  const userId = req.body.userId;
  const date = generateDateTime();

  let dataSet = {};
  let errorRows = [];
  let errorLog = [];

  const readExcelFile = async (filePath) => {
    const workbook = new ExcelJS.Workbook();

    try {
      await workbook.xlsx.readFile(filePath);

      const worksheet = workbook.getWorksheet("Questions Data"); // Or workbook.getWorksheet('SheetName') for a specific sheet

      // worksheet.eachRow((row, rowNumber) => {
      //   if (rowNumber >= 7) {
      //     const rowData = [];
      //     let rowHasError = false;
      //      // console.log(`Row ${rowNumber}:`);
      //     row.eachCell((cell, colNumber) => {
      //        // console.log(`Column ${colNumber}: ${cell.value}`);
      //       rowData.push(cell.value);
      //       // switch case for validation of cell values
      //       switch (colNumber) {
      //         case 2: // Validation for the first element (e.g., 'amazon')
      //           if (typeof cell.value !== "string" || cell.value.trim() === "") {
      //             rowHasError = true; // String is required, non-empty
      //              // console.log(
      //               `Error: Invalid value in Column 2 (expected non-empty string)`
      //             );
      //           }
      //           break;
      //         case 3: // Validation for the question (e.g., 'Amazon S3...')
      //           if (typeof cell.value !== "string" || cell.value.trim() === "") {
      //             rowHasError = true;
      //              // console.log(
      //               `Error: Invalid value in Column 3 (expected non-empty string)`
      //             );
      //           }
      //           break;
      //         case 4: // Validation for answer choices (e.g., '1:2:3:4')
      //           if (
      //             typeof cell.value !== "string" ||
      //             !/^.+(:.+)+$/.test(cell.value) || cell.value.trim() === ""
      //           ) {
      //             rowHasError = true;
      //              // console.log(
      //               `Error: Invalid value in Column 4 (expected format 'number:number:...')`
      //             );
      //           }
      //           break;
      //         case 5:
      //         const answerChoices = rowData[3];

      //         if (typeof answerChoices === "string" && answerChoices.split(":").some((value) => value == cell.value)) {

      //             if (typeof answerChoices === "string" && cell.value.trim() === "") {
      //                 rowHasError = true;
      //                  // console.log(`Error: Invalid value in Column 5 (expected valid choice from Column 4)`);
      //             }
      //         }else {
      //           rowHasError = true;
      //            // console.log(`Error: Invalid value in Column 5 (answer must match one of the choices in Column 4)`);
      //       }
      //           break;
      //         case 6: // Validation for difficulty level (e.g., 'easy')
      //           const validDifficulties = [
      //             "easy",
      //             "medium",
      //             "hard",
      //             "very hard",
      //           ];
      //           if (
      //             typeof cell.value !== "string" ||
      //             !validDifficulties.includes(cell.value.toLowerCase()) || cell.value.trim() === ""
      //           ) {
      //             rowHasError = true; // Must be one of 'easy', 'medium', 'hard'
      //              // console.log(
      //               `Error: Invalid value in Column 6 (expected 'easy', 'medium', 'hard')`
      //             );
      //           }
      //           break;
      //         case 7: // Validation for category or tag ID (e.g., 13)
      //           if (
      //             typeof cell.value !== "number" ||
      //             cell.value < 0 ||
      //             cell.value > 500
      //           ) {
      //             rowHasError = true; // Must be a non-negative integer
      //              // console.log(
      //               `Error: Invalid value in Column 7 (expected non-negative integer)`
      //             );
      //           }
      //           break;
      //         case 8: // Validation for status or flag (e.g., 1)
      //           if (
      //             typeof cell.value !== "number" ||
      //             ![0, 1].includes(cell.value)
      //           ) {
      //             rowHasError = true; // Must be 0 or 1
      //              // console.log(
      //               `Error: Invalid value in Column 8 (expected 0 or 1)`
      //             );
      //           }
      //           break;
      //         case 9: // Validation for duration or reference (e.g., 23)
      //           if (typeof cell.value !== "number" || cell.value <= 0) {
      //             rowHasError = true; // Must be a positive integer
      //              // console.log(
      //               `Error: Invalid value in Column 9 (expected positive integer)`
      //             );
      //           }
      //           break;
      //         default:
      //           // Handle additional columns if needed
      //           break;
      //       }
      //     });
      //     dataSet = { ...dataSet, [rowNumber]: rowData };
      //     if (rowHasError) {
      //       errorRows.push(rowNumber);
      //     }
      //   }
      // });
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber >= 7) {
          const rowData = [];
          let rowHasError = false;
          let errorTextInRow = '';
          for (let colNumber = 2; colNumber <= 9; colNumber++) {
            const cell = row.getCell(colNumber);
            console.log(`Column ${colNumber}: ${cell.value || 'empty'} (Type: ${typeof cell.value})`);
          }
          // Loop through all columns (even those without values)
          for (let colNumber = 2; colNumber <= 9; colNumber++) {
            const cell = row.getCell(colNumber);
            const cellValue = cell.value ? cell.value : ""; // Handle empty cells

            rowData.push(cellValue);

            // switch case for validation of cell values
            switch (colNumber) {
              case 2: // Validation for the first element (e.g., 'amazon')
                if (typeof cellValue !== "string" || cellValue.trim() === "") {

                  rowHasError = true; // String is required, non-empty
                  console.log(
                    `Error: Invalid value in question Column  (expected non-empty string)`
                  );
                  errorTextInRow = `(Row:- ${rowNumber - 6})` + `Error: Invalid value in question Column  (expected non-empty string) `;
                }
                break;
              case 3: // Validation for the question (e.g., 'Amazon S3...')
                if (typeof cellValue !== "string" || cellValue?.trim() === "") {
                  rowHasError = true;
                  console.log(
                    `Error: Invalid value in description Column  (expected non-empty string)`
                  );
                  errorTextInRow = `(Row:- ${rowNumber - 6})` + `Error: Invalid value in description Column  (expected non-empty string) `;
                }
                break;
              case 4: // Validation for answer choices (e.g., '1:2:3:4')
                if (
                  typeof cellValue !== "string" ||
                  !/^.+(:.+)+$/.test(cellValue) ||
                  cellValue.trim() === ""
                ) {
                  rowHasError = true;
                  console.log(
                    `Error: Invalid value in options Column  (expected non-empty string)`
                  );
                  errorTextInRow = `(Row:- ${rowNumber - 6})` + `Error: Invalid value in options Column  (expected non-empty string) `;
                }
                break;
              case 5: // Validation for the selected answer (it must match a choice from Column 4)
                const answerChoices = rowData[2]; // Get choices from Column 4
                function validateAnswers(answerChoices, answer) {
                  if (answer?.includes(":")) {
                    const validation = /^.+(:.+)+$/.test(cellValue);
                    if (validation) {
                      const answerChoicesArray = answerChoices.includes(":")
                        ? answerChoices
                          .split(":")
                          .map((choice) => choice.trim())
                        : [answerChoices.trim()];
                      const answerArray = answer.includes(":")
                        ? answer.split(":").map((choice) => choice.trim())
                        : [answer.trim()];

                      return answerArray.every((answerPart) =>
                        answerChoicesArray.includes(answerPart)
                      );
                    } else {
                      return false;
                    }
                  }
                  return answerChoices
                    .split(":")
                    .some((value) => value == answer);
                }
                console.log("answer choices:", answerChoices);
                console.log("cellValue", cellValue);
                if (
                  typeof answerChoices === "string" &&
                  validateAnswers(answerChoices, String(cellValue))
                  // answerChoices.split(":").some((value) => value == cellValue)
                ) {
                  if (
                    typeof cellValue === "string" &&
                    cellValue?.trim() === ""
                  ) {
                    rowHasError = true;
                    console.log(
                      `Error: Invalid value in options Column  (expected non-empty string)`
                    );
                    errorTextInRow = `(Row:- ${rowNumber - 6})` + `Error: Invalid value in correct options Column  (expected non-empty string) and must match one of the options  `;
                  }
                } else {
                  rowHasError = true;
                  errorTextInRow = `(Row:- ${rowNumber - 6}) Error: Answer does not match any of the available options`;
                }
                break;
              case 6: // Validation for difficulty level (e.g., 'easy')
                const validDifficulties = [
                  "easy",
                  "medium",
                  "hard",
                  "very hard",
                ];
                if (
                  typeof cellValue !== "string" ||
                  !validDifficulties.includes(cellValue.toLowerCase()) ||
                  cellValue.trim() === ""
                ) {
                  rowHasError = true; // Must be one of 'easy', 'medium', 'hard'
                  console.log(
                    `Error: Invalid value in difficulty Column  (Must be one of 'easy', 'medium', 'hard')`
                  );
                  errorTextInRow = `(Row:- ${rowNumber - 6})` + `Error: Invalid value in difficulty Column  (Must be one of 'easy', 'medium', 'hard') `;
                }
                break;
              case 7: // Validation for category or tag ID (e.g., 13)
                if (
                  typeof cellValue !== "number" ||
                  cellValue < 0 ||
                  cellValue > 500
                ) {
                  rowHasError = true; // Must be a non-negative integer
                  console.log(
                    `Error: Invalid value in marks Column  (Must be a non-negative integer)`
                  );
                  errorTextInRow = `(Row:- ${rowNumber - 6})` + `Error: Invalid value in marks Column  (Must be a non-negative integer) `;
                }
                break;
              case 8: // Validation for status or flag (e.g., 1)
                let normalizedValue = cellValue;

                if (cellValue === "" || cellValue === null || cellValue === undefined) {
                  normalizedValue = 0;
                }
                // Handle boolean values
                else if (typeof cellValue === "boolean") {
                  normalizedValue = cellValue ? 1 : 0;
                }
                // Convert string numbers to actual numbers (trim whitespace first)
                else if (typeof cellValue === "string") {
                  const trimmed = cellValue.trim();
                  if (!isNaN(trimmed) && trimmed !== "") {
                    normalizedValue = Number(trimmed);
                  }
                }

                // Convert to integer to handle floating point issues
                if (typeof normalizedValue === "number") {
                  normalizedValue = Math.round(normalizedValue);
                }

                console.log('Original cellValue:', cellValue, 'type:', typeof cellValue);
                console.log('normalizedValue:', normalizedValue, 'type:', typeof normalizedValue);
                console.log('Strict equality check - is 0?', normalizedValue === 0, 'is 1?', normalizedValue === 1);
                if (normalizedValue !== 0 && normalizedValue !== 1) {
                  console.log('"', normalizedValue, '"', 'cellvalue type check is negative')
                  rowHasError = true;
                  console.log(
                    `Error: Invalid value in is_negative column  (Must be 0 or 1)`
                  );
                  errorTextInRow = `(Row:- ${rowNumber - 6})` + `Error: Invalid value in is_negative column  (Must be 0 or 1) `;
                } else {
        console.log('CASE 8 PASSED - Value is valid:', normalizedValue);
    }
                break;
              case 9: // Validation for duration or reference (e.g., 23)
                // Handle empty cells - default to 0
                let negativeMarksValue = cellValue;
                if (cellValue === "" || cellValue === null || cellValue === undefined) {
                  negativeMarksValue = 0;
                } else if (typeof cellValue === "string" && !isNaN(cellValue)) {
                  negativeMarksValue = Number(cellValue);
                }

                if (negativeMarksValue < 0) {
                  console.log(typeof cellValue, 'cellvalue type check')
                  rowHasError = true;
                  console.log(
                    `Error: Invalid value in negative marks column  (Must be non-negative integer)`
                  );
                  errorTextInRow = `(Row:- ${rowNumber - 6})` + `Error: Invalid value in negative marks column  (Must be non-negative integer) `;
                }
                break;
              default:
                // Handle additional columns if needed
                break;
            }
          }

          dataSet = { ...dataSet, [rowNumber]: rowData };

          if (rowHasError) {
            errorRows.push(rowNumber);
            errorLog.push(errorTextInRow);
            // return res.status(500).send({message: `Error in row ${rowNumber-6}: ${errorTextInRow}`});
          }
        }
        console.log('errorlog:', errorLog);
      });
    } catch (error) {
      console.error("Error reading the Excel file:", error);
    }
  };
  try {
    await readExcelFile(filePath);

    QuestionFiles.insertQuestions(
      fileId,
      errorRows,
      errorLog,
      dataSet,
      userId,
      date,
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            return res.status(404).send({ message: "Data not found" });
          } else if (!res.headersSent) {
            return res.status(500).send({ message: "Error inserting questions data" });
          }
        } else {
          res.send(data); // Send the inserted data response (including IDs)
        }
      }
    );
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Failed to process the Excel file." });
  }
};

// exports.getSampleFile = (req, res) => {
//   const filePath = path.join(
//     __dirname,
//     "../../gotestli-web/client/public/samplefile/SampleExcelFile.xlsx"
//   );
//   res.download(filePath, "SampleExcelFile.xlsx", (err) => {
//     if (err) {
//       console.error("Error downloading file:", err);
//       res.status(500).send({
//         message: "Error downloading the file",
//       });
//     }
//   });
// };

exports.getUploadedFile = (req, res) => {
  const type = req.query.type;
  const fileName = req.query.fileName;
  let filePath = "";
  if (type == "samplefile") {
    filePath = path.join(
      __dirname,
      "../../gotestli-web/client/public/samplefile/SampleExcelFile.xlsx"
    );
  } else {
    filePath = path.join(__dirname, `../../gotestli-web/uploads/${fileName}`);
  }

  res.download(filePath, fileName, (err) => {
    if (err) {
      console.error("Error downloading file:", err);
      res.status(500).send({
        message: "Error downloading the file",
      });
    }
  });
};

exports.findById = (req, res) => {
  const { start, end, search } = req.query;
  const { orgid } = req.query;
  QuestionFiles.findById(req.params.id, start, end, search, orgid, (err, data) => {
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
    } else {
      cache.set(req.originalUrl, data);
      res.send(data);
    }
  });
};

exports.findByFileName = (req, res) => {
  const { orgid } = req.query;
  QuestionFiles.findByFileName(req.query.filename, orgid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found file with filename ${req.query.filename}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving file with filenam " + req.query.filename,
        });
      }
    } else {
      cache.set(req.originalUrl, data);
      res.send(data);
    }
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
