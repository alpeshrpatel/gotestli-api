const QuestionFiles = require("../models/questionfiles.model");
const generateDateTime = require("../utils/util");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const { cache } = require("../middleware/cacheMiddleware");
const { error } = require("console");
require('dotenv').config();


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

                // console.log('Original cellValue:', cellValue, 'type:', typeof cellValue);
                // console.log('normalizedValue:', normalizedValue, 'type:', typeof normalizedValue);
                // console.log('Strict equality check - is 0?', normalizedValue === 0, 'is 1?', normalizedValue === 1);
                if (normalizedValue !== 0 && normalizedValue !== 1) {
                  // console.log('"', normalizedValue, '"', 'cellvalue type check is negative')
                  rowHasError = true;
                  // console.log(
                  //   `Error: Invalid value in is_negative column  (Must be 0 or 1)`
                  // );
                  errorTextInRow = `(Row:- ${rowNumber - 6})` + `Error: Invalid value in is_negative column  (Must be 0 or 1) `;
                } else {
        // console.log('CASE 8 PASSED - Value is valid:', normalizedValue);
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
        // console.log('errorlog:', errorLog);
      });
    } catch (error) {
      // console.error("Error reading the Excel file:", error);
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


// Backend API endpoint for Excel validation and AI error report generation
// const ExcelJS = require('exceljs');
// const fs = require('fs');
// const path = require('path');
const PDFDocument = require('pdfkit');


const GROQ_API_KEY = process.env.GROQ_API_KEY; 
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

exports.previewAndValidateExcel = async (req, res) => {
  const filePath = req.file?.path || req.body.filePath;
  const {orgId, userId} = req.query;
  
  if (!filePath) {
    return res.status(400).send({ message: "No file provided" });
  }

  try {

    // Step 1: Parse and validate Excel file
    const validationResult = await validateExcelFile(filePath,orgId, userId);

    
    // Step 2: Generate AI-powered error report if there are errors
    let aiErrorReport = null;
    if (validationResult.errors.length > 0) {
      aiErrorReport = await generateAIErrorReport(validationResult);
    }
    
    // Step 3: Generate PDF report if requested
    const pdfPath = await generateErrorPDF(validationResult, aiErrorReport);
    
    // Step 4: Return response with validation results
    res.json({
      isValid: validationResult.errors.length === 0,
      totalRows: validationResult.totalRows,
      validRows: validationResult.validRows,
      errorRows: validationResult.errorRows,
      errors: validationResult.errors,
      aiAnalysis: aiErrorReport,
      pdfReportPath: pdfPath,
      preview: validationResult.preview
    });

  } catch (error) {
    console.error('Error validating Excel file:', error);
    res.status(500).send({ message: "Failed to validate Excel file", error: error.message });
  }
};


async function validateExcelFile(filePath,orgId, userId) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  
  const worksheet = workbook.getWorksheet("Questions Data");
  if (!worksheet) {
    throw new Error("Worksheet 'Questions Data' not found");
  }

  const validationResult = {
    totalRows: 0,
    validRows: 0,
    errorRows: [],
    errors: [],
    preview: [],
    dataSet: {}
  };
 const rowPromises = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber >= 7) { 
      validationResult.totalRows++;
      
      const rowData = [];
      let rowErrors = [];
      let hasError = false;

      
      for (let colNumber = 2; colNumber <= 9; colNumber++) {
        const cell = row.getCell(colNumber);
        const cellValue = cell.value || "";
        rowData.push(cellValue);

        
        const columnError = validateCell(colNumber, cellValue, rowData, rowNumber);
        if (columnError) {
          rowErrors.push(columnError);
          hasError = true;
        } 
      }

       const rowPromise = new Promise((resolve) => {
        // If row already has errors, no need to check for question duplication
        if (hasError) {
          const result = {
            rowNumber,
            rowData,
            hasError: true,
            rowErrors,
            isValid: false
          };
          resolve(result);
        } else {
          // Only check for question duplication if no other errors exist
          const questionValue = rowData[0]; // Assuming question is in column 2 (index 0 in rowData)
          
          QuestionFiles.CheckQuestionExists(questionValue, orgId, userId, (err, data) => {
            if (err) {
              console.error(`Error checking question existence in row ${rowNumber}:`, err);
              rowErrors.push(`Error checking question existence: ${err.message}`);
              hasError = true;
            }
            
            // console.log(data, 'data from check question exists');
            if (data) {
              rowErrors.push(`Question "${questionValue}" already exists`);
              hasError = true;
            }
            
            const result = {
              rowNumber,
              rowData,
              hasError,
              rowErrors,
              isValid: !hasError
            };
            resolve(result);
          });
        }
      });

      rowPromises.push(rowPromise);

      validationResult.dataSet[rowNumber] = rowData;
    }
    
  });
  const rowResults = await Promise.all(rowPromises);
  
  // Process the results
  rowResults.forEach(({ rowNumber, rowData, hasError, rowErrors, isValid }) => {
    if (hasError) {
      validationResult.errorRows.push(rowNumber - 6);
      validationResult.errors.push({
        row: rowNumber - 6,
        errors: rowErrors,
        data: rowData
      });
    } else {
      validationResult.validRows++;
    }
    
    // Add to preview
    validationResult.preview.push({
      row: rowNumber - 6,
      data: rowData,
      hasError,
      errors: rowErrors
    });
    
    validationResult.dataSet[rowNumber] = rowData;
  });
  

  return validationResult;
}

// Cell validation function
function validateCell(colNumber, cellValue, rowData, rowNumber) {
  const displayRow = rowNumber - 6;
  
  switch (colNumber) {
    case 2: // Question column
      if (typeof cellValue !== "string" || cellValue.trim() === "") {
        return `Column 2 (Question): Expected non-empty string, got "${cellValue}"`;
      }
      break;
      
    case 3: // Description column
      if (typeof cellValue !== "string" || cellValue?.trim() === "") {
        return `Column 3 (Description): Expected non-empty string, got "${cellValue}"`;
      }
      break;
      
    case 4: // Options column (format: option1:option2:option3)
      if (typeof cellValue !== "string" || !/^.+(:.+)+$/.test(cellValue) || cellValue.trim() === "") {
        return `Column 4 (Options): Expected format 'option1:option2:option3', got "${cellValue}"`;
      }
      break;
      
    case 5: // Correct answer column
      const answerChoices = rowData[2]; // Options from column 4
      if (!validateAnswer(answerChoices, cellValue)) {
        return `Column 5 (Answer): "${cellValue}" does not match any option from "${answerChoices}"`;
      }
      break;
      
    case 6: // Difficulty column
      const validDifficulties = ["easy", "medium", "hard", "very hard"];
      if (typeof cellValue !== "string" || !validDifficulties.includes(cellValue.toLowerCase()) || cellValue.trim() === "") {
        return `Column 6 (Difficulty): Expected one of [${validDifficulties.join(', ')}], got "${cellValue}"`;
      }
      break;
      
    case 7: // Marks column
      if (typeof cellValue !== "number" || cellValue < 0 || cellValue > 500) {
        return `Column 7 (Marks): Expected number between 0-500, got "${cellValue}"`;
      }
      break;
      
    case 8: // Is_negative column (0 or 1)
      const normalizedValue = normalizeBoolean(cellValue);
      if (normalizedValue !== 0 && normalizedValue !== 1) {
        return `Column 8 (Is_negative): Expected 0 or 1, got "${cellValue}"`;
      }
      break;
      
    case 9: // Negative marks column
      const negativeMarks = cellValue === "" || cellValue == null ? 0 : Number(cellValue);
      if (isNaN(negativeMarks) || negativeMarks < 0) {
        return `Column 9 (Negative Marks): Expected non-negative number, got "${cellValue}"`;
      }
      break;
  }
  
  return null; // No error
}

// Helper functions
function validateAnswer(answerChoices, answer) {
  if (typeof answerChoices !== "string") return false;
  
  const choices = answerChoices.split(":").map(choice => choice.trim());
  
  if (String(answer).includes(":")) {
    const answers = String(answer).split(":").map(ans => ans.trim());
    return answers.every(ans => choices.includes(ans));
  }
  
  return choices.includes(String(answer).trim());
}

function normalizeBoolean(value) {
  if (value === "" || value === null || value === undefined) return 0;
  if (typeof value === "boolean") return value ? 1 : 0;
  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!isNaN(trimmed) && trimmed !== "") return Math.round(Number(trimmed));
  }
  if (typeof value === "number") return Math.round(value);
  return -1; // Invalid
}

// AI Error Report Generation using Groq (free alternative to OpenAI)
async function generateAIErrorReport(validationResult) {
  try {
    const prompt = `
You are an expert data analyst. Analyze the following Excel validation errors and provide a comprehensive report.

Validation Summary:
- Total Rows: ${validationResult.totalRows}
- Valid Rows: ${validationResult.validRows}
- Error Rows: ${validationResult.errorRows.length}

Errors Found:
${validationResult.errors.map(error => 
  `Row ${error.row}: ${error.errors.join('; ')}`
).join('\n')}

Please provide:
1. A summary of the most common errors
2. Specific recommendations to fix each type of error
3. Data quality insights
4. Step-by-step correction guide
5. Prevention tips for future uploads

Keep the response professional and actionable.
    `;
   
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192', // Free model
        messages: [
          {
            role: 'system',
            content: 'You are a helpful data analyst assistant specialized in Excel data validation and error reporting.'
          },
          {
            role: 'user', 
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 2000
      })
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.statusText}`);
    }

    const result = await response.json();
    return result.choices[0].message.content;
    
  } catch (error) {
   
    return "AI analysis unavailable. Please check the errors manually.";
  }
}

// Generate PDF Error Report
async function generateErrorPDF(validationResult, aiReport) {
  const doc = new PDFDocument();
  const fileName = `error-report-${Date.now()}.pdf`;
  const filePath = path.join(__dirname, '../reports', fileName);
  
  // Ensure reports directory exists
  const reportsDir = path.dirname(filePath);
  if (!fs.existsSync(reportsDir)) {
    fs.mkdirSync(reportsDir, { recursive: true });
  }
  
  doc.pipe(fs.createWriteStream(filePath));
  
  // PDF Header
  doc.fontSize(20).text('Excel Validation Report', 100, 100);
  doc.fontSize(12).text(`Generated on: ${new Date().toLocaleString()}`, 100, 130);
  
  // Summary Section
  doc.fontSize(16).text('Validation Summary', 100, 170);
  doc.fontSize(12)
     .text(`Total Rows Processed: ${validationResult.totalRows}`, 100, 200)
     .text(`Valid Rows: ${validationResult.validRows}`, 100, 220)
     .text(`Rows with Errors: ${validationResult.errorRows.length}`, 100, 240);
  
  let yPosition = 280;
  
  // Detailed Errors
  if (validationResult.errors.length > 0) {
    doc.fontSize(16).text('Detailed Error List', 100, yPosition);
    yPosition += 30;
    
    validationResult.errors.forEach((error, index) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(12)
         .text(`Row ${error.row}:`, 100, yPosition)
         .text(error.errors.join('\n'), 120, yPosition + 15);
      
      yPosition += (error.errors.length * 15) + 25;
    });
  }
  
  // AI Analysis Section
  if (aiReport) {
    doc.addPage();
    doc.fontSize(16).text('AI Analysis & Recommendations', 100, 50);
    doc.fontSize(10).text(aiReport, 100, 80, { width: 400 });
  }
  
  doc.end();
  
  return fileName;
}