const ContactMessages = require("../models/contactmessages.model");
const generateDateTime = require("../utils/util");

// Create and Save a new ContactMessages
exports.create = (req, res) => {
      // Validate request
      console.log(req.body)
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }

    //   const createdDate = generateDateTime();
      // Save ContactMessages in the database
      ContactMessages.create(req.body , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the ContactMessages."
          });
        else res.send(data);
      });
};

exports.findById =  (req, res) => {
    ContactMessages.findById(req.params.id, (err, data) => {
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


// Delete all ContactMessagess from the database.
exports.deleteAll = (req, res) => {
  ContactMessages.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all ContactMessagess."
      });
    else res.send({ message: `All ContactMessagess were deleted successfully!` });
  });
};