const express = require("express");
const bodyParser = require("body-parser");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
const connection = require("./config/mysql.db.config.js");
const option = require('./swagger.js')



const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const specs = swaggerJsdoc(options);
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

var corsOptions = {
  origin: "http://localhost:8081"
};

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json()); /* bodyParser.json() is deprecated */

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true })); /* bodyParser.urlencoded() is deprecated */

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

  

// // Custom middleware to intercept all requests
// app.use((req, res, next) => {
//   // Modify the response body or perform any other actions
//   console.log(`Intercepted response: ${res.json} `);
//   console.log(JSON.stringify(res));
//   next(); 
// });

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
// ====================================