const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const queries = require("./queries.js");
const { default: axios } = require("axios");

const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const connection = require("./config/mysql.db.config.js");
const option = require("./swagger.js");
const multer = require("multer");
const ExcelJS = require("exceljs");
const path = require("path");

const port = 3000;

// Define the CORS options
const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"], // Whitelist the domains you want to allow
};

const app = express();
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const specs = swaggerJsdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to testli-api." });
});
// Custom middleware to intercept all requests
app.use((req, res, next) => {
  // Modify the response body or perform any other actions
  console.log(`Intercepted request: ${req.method} ${req.url}`);
  console.log(JSON.stringify(req.body));
  next();
});

require("./routes/questionset.route.js")(app);
require("./routes/category.route.js")(app);
require("./routes/questionmaster.route.js")(app);
require("./routes/user.result.route.js")(app);
require("./routes/user.result.detail.route.js")(app);
require("./routes/users.route.js")(app);
require("./routes/questionoptions.route.js")(app);
require("./routes/questionsetcategory.route.js")(app);
require("./routes/questionsetquestion.route.js")(app);
require("./routes/userspreferences.route.js")(app);
require("./routes/followerslist.route.js")(app);

const uploadFolder = "../gotestli-web/uploads/";

// Configure multer for file upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder); 
  },
  filename: (req, file, cb) => {
   
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Handle file upload request
app.post("/api/file/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded." });
    }
    const filePath = req.file.path; // Path to the uploaded file

    // Create a new ExcelJS workbook and read the file
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    // Get the first worksheet
    // console.log("workbook:",workbook)

    const worksheet = workbook.getWorksheet("Project Management Data");

    // Loop through rows of the worksheet
    worksheet.eachRow((row, rowNumber) => {
      console.log(`Row ${rowNumber}:`);
      row.eachCell((cell, colNumber) => {
        console.log(`Cell ${colNumber}: ${cell.value}`);
      });
    });
    // Check if the first row matches the required format
    const expectedHeaders = [
      "question",
      "description",
      "complexity",
      "marks",
      "is_negative",
      "negative_marks",
    ];
    const actualHeaders = [];
    //  console.log("worksheet : ",worksheet);
    worksheet.getRow(6).eachCell((cell, colNumber) => {
      actualHeaders.push(cell.value ? cell.value.trim().toLowerCase() : '');
    });

    const normalizedExpectedHeaders = expectedHeaders.map(header => header.trim().toLowerCase());
    console.log("actual headers: ", actualHeaders);
    // Validate the headers
    if (
      normalizedExpectedHeaders.length !== actualHeaders.length ||
      !normalizedExpectedHeaders.every((header, index) => header === actualHeaders[index])
    ) {
      return res.status(400).send({ message: "Invalid data format in Excel sheet!" });
    } else {
      // If headers are valid, loop through the rows to check data
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return; // Skip header row

        console.log(`Row ${rowNumber}:`);
        row.eachCell((cell, colNumber) => {
          console.log(`Cell ${colNumber}: ${cell.value}`);
        });
      });
    }

    // Initialize an array to store parsed data
    // const parsedData = [];
    // worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
    //   const rowData = [];
    //   row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
    //     rowData.push(cell.value); // Add cell data to rowData array
    //   });
    //   parsedData.push(rowData); // Add row data to parsedData array
    // });
    // console.log("parsed data: ", parsedData);
    res.status(200).send({ message: "File uploaded successfully!" });
  } catch (error) {
    console.log("error: ", error);
    res.status(500).send({ message: "File upload failed!", error });
  }
});

// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  connection.getConnection((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      return;
    }
    console.log("Connected to MySQL!");
  });
});
