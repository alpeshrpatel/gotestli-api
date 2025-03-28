const { cache } = require("../middleware/cacheMiddleware");
const WhiteListedQSet = require("../models/whitelistedquestionset.model");
const generateDateTime = require("../utils/util");

// Create and Save a new WhiteListedQSet
exports.create = (req, res) => {
      // Validate request
      
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
      const data = {questionset_id:req.body.questionSetId,user_id:req.body.userId,ins_id:req.body.insId}
    //   const createdDate = generateDateTime();
      // Save WhiteListedQSet in the database
      WhiteListedQSet.create(data , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the WhiteListedQSet."
          });
        else res.send(data);
      });
};

exports.getMyPurchases =  (req, res) => {
    WhiteListedQSet.getMyPurchases(req.params.userId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.send({
            message: `Not found purchase with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving purchase with id " + req.params.id
          });
        }
      } else{
        // cache.set(req.originalUrl, data);
        res.send(data);
      };
    });
  };