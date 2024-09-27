const UsersPreferences = require("../models/userspreferences.model");
const generateDateTime = require("../utils/util");

// Create and Save a new UsersPreferences
exports.create = (req, res) => {
      // Validate request
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
      console.log(req.body.tagsId)
      const tagsId = req.body.tagsId;
      let tagsIddata = tagsId.split(',');
      let dataSet = []
     tagsIddata.forEach((tags) => {
      const createdDate = generateDateTime();
      const data = [
        req.body.user_id,
        tags,
        req.body.user_id,
        createdDate,
        req.body.user_id,
        createdDate
      ]
      dataSet.push(data);
     })
     console.log(dataSet)


      // Create a UsersPreferences
      const usersPreferences = new UsersPreferences({
        // id : req.body.id,
        user_id : req.body.user_id,
        category_id : req.body.category_id,
        // created_by : req.body.created_by,
        // created_date : req.body.created_date,
        // modified_by : req.body.modified_by,
        // modified_date : req.body.modified_date,
        });

      // Save UsersPreferences in the database
      UsersPreferences.create(dataSet, (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the UsersPreferences."
          });
        else res.send(data);
      });
};

exports.findById =  (req, res) => {
    UsersPreferences.findById(req.params.id, (err, data) => {
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

// updateById


exports.getCategoriesByUserId =  (req, res) => {
    UsersPreferences.getCategoriesByUserId(req.params.id, (err, data) => {
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
      } else res.send(data);
    });
  };
 


// // Update a UsersPreferences identified by the id in the request
// exports.update = (req, res) => {
//   // Validate Request
//   if (!req.body) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//   }

//   console.log(req.body);

//   UsersPreferences.updateById(
//     req.params.id,
//     new UsersPreferences(req.body),
//     (err, data) => {
//       if (err) {
//         if (err.kind === "not_found") {
//           res.status(404).send({
//             message: `Not found UsersPreferences with id ${req.params.id}.`
//           });
//         } else {
//           res.status(500).send({
//             message: "Error updating UsersPreferences with id " + req.params.id
//           });
//         }
//       } else res.send(data);
//     }
//   );
// };

// Delete a UsersPreferences with the specified id in the request
exports.delete = (req, res) => {
  UsersPreferences.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found UsersPreferences with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete UsersPreferences with id " + req.params.id
        });
      }
    } else res.send({ message: `UsersPreferences was deleted successfully!` });
  });
};

// // Delete all UsersPreferencess from the database.
// exports.deleteAll = (req, res) => {
//   const user_id = req.body.user_id
//   UsersPreferences.removeAll(user_id,(err, data) => {
//     if (err)
//       res.status(500).send({
//         message:
//           err.message || "Some error occurred while removing all UsersPreferencess."
//       });
//     else res.send({ message: `All UsersPreferencess were deleted successfully!` });
//   });
// };
