const { cache } = require("../middleware/cacheMiddleware.js");
const Users = require("../models/users.model.js");
const jwt = require("jsonwebtoken");

// Create and Save a new users
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

  // Create a users
  const users = new Users({
    ip_address: req.body.ip_address,
    username: req.body.username,
    password: req.body.password,
    email: req.body.email,
    activation_selector: req.body.activation_selector,
    activation_code: req.body.activation_code,
    forgotten_password_selector: req.body.forgotten_password_selector,
    forgotten_password_code: req.body.forgotten_password_code,
    forgotten_password_time: req.body.forgotten_password_time,
    remember_selector: req.body.remember_selector,
    remember_code: req.body.remember_code,
    created_on: req.body.created_on,
    last_login: req.body.last_login,
    active: req.body.active,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    company: req.body.company,
    phone: req.body.phone,
    // profile_pic : req.body.profile_pic,
    // created_by : req.body.created_by,
    // created_date : req.body.created_date,
    // modified_by : req.body.modified_by,
    // modified_date : req.body.modified_date,
    is_delete: 0,
    uid: req.body.uid,
    role: req.body.role,
    provider: req.body.provider,
    org_id:req.body.org_id
  });

  // Save users in the database
  Users.create(users, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while creating the users.",
      });
    else res.send(data);
  });
};

exports.generateToken = async (req,res) => {
  const {id} = req.params;
   // Generate JWT token
   const token = jwt.sign({ id: id }, process.env.JWT_SECRET, { expiresIn: '24h' });
   res.json({ token });
}

// Retrieve all Users from the database (with condition).
exports.findAll = async (req, res) => {
  Users.getAll(req.params.orgid,(err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
      else{
        cache.set(req.originalUrl, data);
        res.send(data);
      };
  });
};

exports.findAllStudentsList = async (req, res) => {
  const {start,end,search,orgid} = req.query
  Users.getAllStudentsList(start,end,search,orgid,(err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    else{
      cache.set(req.originalUrl, data);
      res.send(data);
    };
  });
}
// findAllInstructorsList
exports.findAllInstructorsList = async (req, res) => {
  const {start,end,search,orgid} = req.query
  Users.getAllInstructorsList(start,end,search,orgid,(err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    else{
      cache.set(req.originalUrl, data);
      res.send(data);
    };
  });
}

// Find a single users by Id
exports.findOne = async (req, res) => {
  const {orgid} = req.query;
  Users.findById(req.params.userid,orgid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.params.userid}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with id " + req.params.userid,
        });
      }
    } else{
      cache.set(req.originalUrl, data);
      res.send(data);
    };
  });
};

exports.findUser = async (req, res) => {
  const {orgid} = req.query;
  Users.findUser(req.params.uid,orgid, (err, data) => {  
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.params.uid}.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving user with id " + req.params.uid,
        });
      }
    }else{
      cache.set(req.originalUrl, data);
      res.send(data);
    };
  });
};
// // Update a users identified by the id in the request
exports.updateUser = (req, res) => {
  const {orgid} = req.query;
  // Validate Request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }

   

  Users.updateUser(req.params.userid, req.body,orgid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found users with id ${req.params.userid}.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating users with id " + req.params.userid,
        });
      }
    } else res.send(data); 
  });
};

// Delete a user with the specified id in the request
exports.delete = (req, res) => {
  Users.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found user with id ${req.params.id}.`,
        });
      } else {
        res.status(500).send({
          message: "Could not delete user with id " + req.params.id,
        });
      }
    } else res.send({ message: `user was deleted successfully!` });
  });
};

// Delete all Users from the database.
exports.deleteAll = (req, res) => {
  Users.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred while removing all users.",
      });
    else res.send({ message: `All Users were deleted successfully!` });
  });
};
