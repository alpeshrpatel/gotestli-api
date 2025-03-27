const { cache } = require("../middleware/cacheMiddleware");
const UserPurchases = require("../models/userpurchases.model");
const generateDateTime = require("../utils/util");

// Create and Save a new UserPurchases
exports.create = (req, res) => {
      // Validate request
      
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
      const data = {questionset_id:req.body.questionSetId,user_id:req.body.userId,ins_id:req.body.insId}
    //   const createdDate = generateDateTime();
      // Save UserPurchases in the database
      UserPurchases.create(data , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the UserPurchases."
          });
        else res.send(data);
      });
};

exports.getMyPurchases =  (req, res) => {
    UserPurchases.getMyPurchases(req.params.userId, (err, data) => {
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