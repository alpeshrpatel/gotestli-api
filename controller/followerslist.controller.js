const { cache } = require("../middleware/cacheMiddleware");
const FollowersList = require("../models/followerslist.model");
const generateDateTime = require("../utils/util");

// Create and Save a new FollowersList
exports.create = (req, res) => {
      // Validate request
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }

      const createdDate = generateDateTime();
      // Save FollowersList in the database
      FollowersList.create(req.body, createdDate , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the FollowersList."
          });
        else res.send(data);
      });
};

exports.findById =  (req, res) => {
    FollowersList.findById(req.params.id, (err, data) => {
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

  //getFollowerDetail
  exports.getFollowerDetail =  (req, res) => {
    FollowersList.getFollowerDetail(req.params.id, (err, data) => {
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
// updateById


exports.getCategoriesByUserId =  (req, res) => {
    FollowersList.getCategoriesByUserId(req.params.id, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
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
 



// Delete a FollowersList with the specified id in the request
exports.delete = (req, res) => {
  FollowersList.remove(req.params.instructor_id,req.params.follower_id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found FollowersList with id ${req.params.instructor_id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete FollowersList with id " + req.params.instructor_id
        });
      }
    } else res.send({ message: `FollowersList was deleted successfully!` });
  });
};

// Delete all FollowersLists from the database.
exports.deleteAll = (req, res) => {
  FollowersList.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all FollowersLists."
      });
    else res.send({ message: `All FollowersLists were deleted successfully!` });
  });
};
