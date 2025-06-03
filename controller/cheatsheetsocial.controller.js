const { cache } = require("../middleware/cacheMiddleware");
const CheatsheetSocial = require("../models/cheatsheetsocial.model");
const generateDateTime = require("../utils/util");

// Create and Save a new CheatsheetSocial
exports.create = (req, res) => {
      // Validate request
      
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
     
    //   const createdDate = generateDateTime();
      // Save CheatsheetSocial in the database
      CheatsheetSocial.create(req.body , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the CheatsheetSocial."
          });
        else res.send(data);
      });
};

//getCheatsheetSocialOfQuestion

exports.getCheatsheetLikes =  (req, res) => {
  console.log(req.params)
  
  CheatsheetSocial.getCheatsheetLikes(req.params.cheatsheetid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found CheatsheetSocial with id ${req.params.cheatsheetid}.`, status:false
        });
      } else {
        res.status(500).send({
          message: "Error retrieving CheatsheetSocial with id "+ err + req.params.cheatsheetid
        });
      }
    } else{
      // cache.set(req.originalUrl, data);
      res.send(data);
    };
  });
};

exports.updateCheatsheetLikes = (req, res) => {

  CheatsheetSocial.updateCheatsheetLikes(req.params.cheatsheetid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found CheatsheetSocial with id ${req.params.cheatsheetid}.`
        });
      } else {
        res.status(500).send({
          message: "Error updating CheatsheetSocial with id " + err + req.params.cheatsheetid
        });
      }
    } else {
      // cache.set(req.originalUrl, data);
      res.send(data);
    }
  });

}