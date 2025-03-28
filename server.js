const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const queries = require("./queries.js");
const { default: axios } = require("axios");

const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const connection = require("./config/mysql.db.config.js");
const options = require("./swagger.js");
const multer = require("multer");
const ExcelJS = require("exceljs");
const path = require("path");
const fs = require("fs");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv');
const Stripe = require("stripe");

const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });


// Define the CORS options
const corsOptions = {
  credentials: true,
  origin: [process.env.BACKEND_URL], 
};


const app = express();

 app.use(cors());

app.use((req, res, next) => {
  const host = req.hostname; 
  const subdomain = host.split(".")[0]; 

  if (subdomain !== "www" && subdomain !== "gotestli") {
      req.tenant = subdomain; 
  }

  next();
});

app.get("/", (req, res) => {
  if (req.tenant) {
      res.send(`Welcome to the tenant: ${req.tenant}`);
  } else {
      res.send("Welcome to GoTestli!");
  }
});

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
  

  if (
    req.url.startsWith("/api/category/selected") ||
    req.url.startsWith("/api/users") ||
    req.url.startsWith("/api/questionset") ||
    req.url.startsWith("/api/category/parent/categories") ||
    req.url == "/api/sendemail/instructor/uploadfile/result" ||
    req.url.startsWith("/api/contact/messages") ||
    req.url.startsWith("/api/waitinglist") ||
    req.url == '/api/sendemail/getintouch/subscribed' ||
    req.url.startsWith("/api/reviews/rating/qset") ||
    req.url.startsWith("/api/questionset/search/result") || 
    req.url.startsWith("/api/question/files/insert/questions") || 
    req.url.startsWith("/api/app/feedback") || 
    req.url.startsWith("/api/sendemail/send/otp")  ||
    req.url.startsWith("/api/forgetpwd/verify/otp") ||
    req.url.startsWith("/api/reviews/get/rating/ratingmeter") || 
    req.url.startsWith("/api/create-paypal-order") || 
    req.url.startsWith("/api/capture-paypal-order") ||
    req.url.includes("sendemail/getintouch/heerrealtor") ||
    req.url.startsWith("/create-payment-intent") || 
    req.url.includes("/v1.api.gotestli.com/sendemail/getintouch/heerrealtor") ||
    req.url.startsWith("/v1.api.gotestli.com/sendemail/getintouch/heerrealtor") ||
    req.url.startsWith('/api/org') ||
    req.url.startsWith('/api/sendemail/org/onboarding/approval') ||
    req.url.startsWith('/api/sendemail/org/user/invitation/from-admin')
  ) {
    return next();
  }
  const authHeader = req.headers.authorization;
 

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
require("./routes/appfeedback.route.js")(app);
require("./routes/comments.route.js")(app);
require("./routes/userpurchases.route.js")(app);
require("./routes/questionparagraph.route.js")(app);
require("./routes/forgetpasswordotp.route.js")(app);
require("./routes/organization.route.js")(app);

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
    

    const fileName = req.file.filename;
    const filePath = req.file.path;

    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    workbook.eachSheet((worksheet, sheetId) => {
     
    });

    const worksheet = workbook.getWorksheet("Questions Data");
    if (!worksheet) {
      return res
        .status(400)
        .send({ message: "Worksheet 'Questions Data' not found!" });
    }

    worksheet.eachRow((row, rowNumber) => {
      
      row.eachCell((cell, colNumber) => {
        
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
      actualHeaders.push(cell.value ? String(cell.value).trim().toLowerCase() : "");
    });

    const normalizedExpectedHeaders = expectedHeaders.map((header) =>
      header.trim().toLowerCase()
    );
    

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

        
        row.eachCell((cell, colNumber) => {
          
        });
      });
    }
    res.status(200).send({
      message: "File uploaded successfully!",
      data: { fileName: fileName, filePath: filePath },
    });
  } catch (error) {
    console.error("File upload error:", error);
    res.status(500).send({ message: "File upload failed!", error: error.message });
  }
});
const paypal = require('@paypal/checkout-server-sdk');
const environment = new paypal.core.SandboxEnvironment(
  process.env.PAYPAL_CLIENT_ID,
  process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// Create PayPal order
app.post('/api/create-paypal-order', async (req, res) => {
  try {
    const request = new paypal.orders.OrdersCreateRequest();
    request.prefer("return=representation");
    request.requestBody({
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'USD',
          value: req.body.amount
        }
      }]
    });

    const order = await client.execute(request);
    res.json({ id: order.result.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Capture PayPal order (complete the transaction)
app.post('/api/capture-paypal-order', async (req, res) => {
  try {
    const request = new paypal.orders.OrdersCaptureRequest(req.body.orderId);
    request.prefer("return=representation");
    
    const capture = await client.execute(request);
    
    // Handle successful payment
    const captureData = capture.result;
    res.json(captureData);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}); 
  // "sk_test_51QoP1kCc5nEXg12i23DtMBNpLgHEHT4tTIGt6At1JA1KmdnNVdidYLL7SqSfZfwsvFUMPjPbUk4Q3B2TV7oqt2ZH00mLQDT77K"
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.post("/create-payment-intent", async (req, res) => {
  try {
      const { amount, currency } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
          amount,
          currency,
          payment_method_types: ["card"],
      });

      res.send({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});

// set port, listen for requests
const PORT = process.env.APP_PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  connection.getConnection((err) => {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      return;
    }
      console.log("Connected to MySQL!");
  });
});

// app.listen(PORT, () => {
//     console.log(`Server is running on port ${PORT}.`);
//   connection.getConnection((err) => {
//     if (err) {
//       console.error("Error connecting to MySQL:", err);
//       return;
//     }
//       console.log("Connected to MySQL!");
//   });
// });
