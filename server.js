const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const queries = require("./queries.js");
const { default: axios } = require("axios");

const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const connection = require("./config/mysql.db.config.js");
const option = require('./swagger.js')

const port = 3000;

// Define the CORS options
const corsOptions = {
  credentials: true,
  origin: ['http://localhost:3000'] // Whitelist the domains you want to allow
};



const app = express();
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);
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
require("./routes/questionoptions.route.js")(app)
require("./routes/questionsetcategory.route.js")(app)
require("./routes/questionsetquestion.route.js")(app)


// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
  connection.getConnection(err => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      return;
    }
    console.log('Connected to MySQL!');
  });
});