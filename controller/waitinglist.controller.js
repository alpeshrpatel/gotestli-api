const { cache } = require("../middleware/cacheMiddleware");
const WaitingList = require("../models/waitinglist.model");
const generateDateTime = require("../utils/util");

// Create and Save a new WaitingList
exports.create = (req, res) => {
      // Validate request
     
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }

    //   const createdDate = generateDateTime();
      // Save WaitingList in the database
      WaitingList.create(req.body , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the WaitingList."
          });
        else res.send(data);
      });
};

exports.findById =  (req, res) => {
    WaitingList.findById(req.params.id, (err, data) => {
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


// Delete all WaitingLists from the database.
exports.deleteAll = (req, res) => {
  WaitingList.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all WaitingLists."
      });
    else res.send({ message: `All WaitingLists were deleted successfully!` });
  });
};
