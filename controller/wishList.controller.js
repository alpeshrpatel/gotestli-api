const WishList = require("../models/wishList.model");
const generateDateTime = require("../utils/util");

// Create and Save a new WishList
exports.create = (req, res) => {
      // Validate request
      console.log(req.body)
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
      const data = {questionset_id:req.body.questionSetId,user_id:req.body.userId}
    //   const createdDate = generateDateTime();
      // Save WishList in the database
      WishList.create(data , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the WishList."
          });
        else res.send(data);
      });
};

exports.findById =  (req, res) => {
    WishList.findById(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.send({
            message: `Not found wishlist with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving wishlist with id " + req.params.id
          });
        }
      } else res.send(data);
    });
  };

  exports.getQsetId =  (req, res) => {
    WishList.getQsetId(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.send({
            message: `Not found wishlist with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving wishlist with id " + req.params.id
          });
        }
      } else res.send(data);
    });
  };

// Delete all WishLists from the database.
exports.deleteOne = (req, res) => {
    console.log(req.params.questionSetId,req.params.userId)
  WishList.remove(req.params.questionSetId,req.params.userId,(err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing WishList."
      });
    else res.send({ message: `WishList were deleted successfully!` });
  });
};
