const { cache } = require("../middleware/cacheMiddleware");
const Badge = require("../models/badge.model");
const generateDateTime = require("../utils/util");

// Create and Save a new Badge



exports.create =  (req, res) => {
    Badge.create(req.params.id,req.params.userId, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found QuestionSet with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving QuestionSet with id " + req.params.id
          });
        }
      } else res.send(data);
    });
  };
 
  exports.getBadges =  (req, res) => {
    Badge.getBadges(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found badge with id ${req.params.id}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving badge with id " + req.params.id
          });
        }
      } else{
        cache.set(req.originalUrl, data);
        res.send(data);
      }
    });
  };
 
