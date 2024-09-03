const Category = require("../models/category.model.js");

// Create and Save a new category
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // Create a Category
  const category = new Category({
    id : req.body.id,
    org_id : req.body.org_id,
    parent_id : req.body.parent_id,
    title : req.body.title,
    description : req.body.description,
    meta_title : req.body.meta_title,
    slug : req.body.slug,
    meta_keyword : req.body.meta_keyword,
    meta_description : req.body.meta_description,
    status : req.body.status,
    show_menu : req.body.show_menu,
    is_parent_id : req.body.is_parent_id,
    is_show_home : req.body.is_show_home,
    icon : req.body.icon,
    position : req.body.position,
    // created_by : req.body.created_by,
    // created_date : req.body.created_date,
    // modified_by : req.body.modified_by,
    // modified_date : req.body.modified_date
  });

  // Save Categoryin the database
  Category.create(category, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Category."
      });
    else res.send(data);
  });
};

// Retrieve all Categories from the database (with condition).
exports.findAll = async(req, res) => {
  Category.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving categories."
      });
    else res.send(data);
  });
};

// Find a single Categoryby Id
exports.findOne = async (req, res) => {
  Category.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Categorywith id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving Category with id " + req.params.id
        });
      }
    } else res.send(data);
  });
};

// // Update a Categoryidentified by the id in the request
// exports.update = (req, res) => {
//   // Validate Request
//   if (!req.body) {
//     res.status(400).send({
//       message: "Content can not be empty!"
//     });
//   }

//   console.log(req.body);

//   Category.updateById(
//     req.params.id,
//     new Category(req.body),
//     (err, data) => {
//       if (err) {
//         if (err.kind === "not_found") {
//           res.status(404).send({
//             message: `Not found Category with id ${req.params.id}.`
//           });
//         } else {
//           res.status(500).send({
//             message: "Error updating Category with id " + req.params.id
//           });
//         }
//       } else res.send(data);
//     }
//   );
// };

// Delete a Category with the specified id in the request
exports.delete = (req, res) => {
  Category.remove(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.status(404).send({
          message: `Not found Category with id ${req.params.id}.`
        });
      } else {
        res.status(500).send({
          message: "Could not delete Category with id " + req.params.id
        });
      }
    } else res.send({ message: `Category was deleted successfully!` });
  });
};

// Delete all Categories from the database.
exports.deleteAll = (req, res) => {
  Category.removeAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all categories."
      });
    else res.send({ message: `All Categories were deleted successfully!` });
  });
};
