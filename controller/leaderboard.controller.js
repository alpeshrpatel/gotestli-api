const { cache } = require("../middleware/cacheMiddleware");
const Leaderboard = require("../models/leaderboard.model");
const generateDateTime = require("../utils/util");

// Create and Save a new Leaderboard
exports.create = (req, res) => {
      // Validate request
     
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }

    //   const createdDate = generateDateTime();
      // Save Leaderboard in the database
      Leaderboard.create(req.body , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Leaderboard."
          });
        else res.send(data);
      });
};

exports.findById =  (req, res) => {
  console.log("req.params.id", req.params.id);
    Leaderboard.findById(Number(req.params.id), (err, data) => {
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
      } else{
        cache.set(req.originalUrl, data);
        res.send(data);
      };
    });
  };


// Delete all Leaderboards from the database.
exports.deleteAll = (req, res) => {
  Leaderboard.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all Leaderboards."
      });
    else res.send({ message: `All Leaderboards were deleted successfully!` });
  });
};
