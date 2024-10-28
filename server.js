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
const fs = require("fs");
const jwt = require("jsonwebtoken");

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

  if (
    req.url.startsWith("/api/category/selected") ||
    req.url.startsWith("/api/users") ||
    req.url == "/api/questionset" ||
    req.url.startsWith("/api/category/parent/categories") ||
    req.url == "/api/sendemail/instructor/uploadfile/result" ||
    req.url.startsWith("/api/contact/messages") ||
    req.url.startsWith("/api/waitinglist") ||
    req.url == '/api/sendemail/getintouch/subscribed' ||
    req.url.startsWith("/api/reviews/rating/qset") ||
    req.url.startsWith("/api/questionset/search/result")
  ) {
    return next();
  }
  const authHeader = req.headers.authorization;
  console.log(authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }

      // req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Token is missing" });
  }
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
require("./routes/questionfiles.route.js")(app);
require("./routes/sendemail.route.js")(app);
require("./controller/cronservice.controller.js")(app);
require("./routes/contactmessages.route.js")(app);
require("./routes/waitinglist.route.js")(app);
require("./routes/badge.route.js")(app);
require("./routes/reviews.route.js")(app);
require("./routes/wishlist.route.js")(app);

const uploadFolder = "../gotestli-web/uploads/";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    const uniqueFileName = generateUniqueFilename(
      file.originalname,
      uploadFolder
    );
    cb(null, uniqueFileName);
  },
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

const generateUniqueFilename = (originalName, uploadFolder) => {
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);

  let filename = originalName;
  let counter = 1;

  while (fs.existsSync(path.join(uploadFolder, filename))) {
    filename = `${baseName}(${counter})${ext}`;
    counter++;
  }

  return filename;
};

app.post("/api/file/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send({ message: "No file uploaded." });
    }
    console.log("req.file:", req.file);

    const fileName = req.file.filename;
    const filePath = req.file.path;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    workbook.eachSheet((worksheet, sheetId) => {
      console.log(`Sheet ${sheetId}: ${worksheet.name}`);
    });

    const worksheet = workbook.getWorksheet("Questions Data");
    if (!worksheet) {
      return res
        .status(400)
        .send({ message: "Worksheet 'Questions Data' not found!" });
    }

    worksheet.eachRow((row, rowNumber) => {
      console.log(`Row ${rowNumber}:`);
      row.eachCell((cell, colNumber) => {
        console.log(`Cell ${colNumber}: ${cell.value}`);
      });
    });

    const expectedHeaders = [
      "index",
      "question",
      "description",
      "question_option",
      "correct_answer",
      "complexity",
      "marks",
      "is_negative",
      "negative_marks",
    ];
    const actualHeaders = [];

    worksheet.getRow(6).eachCell((cell, colNumber) => {
      actualHeaders.push(cell.value ? cell.value.trim().toLowerCase() : "");
    });

    const normalizedExpectedHeaders = expectedHeaders.map((header) =>
      header.trim().toLowerCase()
    );
    console.log("actual headers: ", actualHeaders);

    if (
      normalizedExpectedHeaders.length !== actualHeaders.length ||
      !normalizedExpectedHeaders.every(
        (header, index) => header === actualHeaders[index]
      )
    ) {
      return res
        .status(400)
        .send({ message: "Invalid data format in Excel sheet!" });
    } else {
      worksheet.eachRow((row, rowNumber) => {
        if (rowNumber === 1) return;

        console.log(`Row ${rowNumber}:`);
        row.eachCell((cell, colNumber) => {
          console.log(`Cell ${colNumber}: ${cell.value}`);
        });
      });
    }
    res.status(200).send({
      message: "File uploaded successfully!",
      data: { fileName: fileName, filePath: filePath },
    });
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
