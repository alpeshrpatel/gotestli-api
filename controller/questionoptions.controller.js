const Options = require("../models/questionoptions.model.js");



// Retrieve all Options from the database (with condition).
exports.findAll = async(req, res) => {
  Options.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving options."
      });
    else res.send(data);
  });
};

// Find a single Options by Id
exports.findOne = async (req, res) => {
  Options.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found option with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving option with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};


// Delete a option with the specified id in the request
exports.delete = (req, res) => {
  Options.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found option with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete option with id " + req.params.id
        });
      }
    } else res.send({ message: `option was deleted successfully!` });
  });
};

// Delete all Options from the database.
exports.deleteAll = (req, res) => {
  Options.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Options."
      });
    else res.send({ message: `All Options were deleted successfully!` });
  });
};
