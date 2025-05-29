const { cache } = require("../middleware/cacheMiddleware");

const CheatsheetComment = require("../models/cheatsheetcomments.models");
const generateDateTime = require("../utils/util");

// Create and Save a new CheatsheetComment
exports.create = (req, res) => {
      // Validate request
      console.log(req.body.title)
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
     
    //   const createdDate = generateDateTime();
      // Save CheatsheetComment in the database
      CheatsheetComment.create(req.body , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the CheatsheetComment."
          });
        else res.send(data);
      });
};

//getCheatsheetCommentOfQuestion

exports.getCheatsheetCommentById =  (req, res) => {
  
  const {cheatsheetid} = req.params
  CheatsheetComment.getCheatsheetCommentById(cheatsheetid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found CheatsheetComment for cheatsheetid ${cheatsheetid}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving CheatsheetComment for cheatsheetid "+ err + cheatsheetid
        });
      }
    } else{
      // cache.set(req.originalUrl, data);
      res.send(data);
    };
  });
};

// getRepliesByCommentId
exports.getRepliesByCommentId =  (req, res) => {
  
  const {commentid} = req.query
  CheatsheetComment.getRepliesByCommentId(commentid, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found CheatsheetComment for title ${commentid}.`
        });
      } else {
        res.status(500).send({
          message: "Error retrieving CheatsheetComment for title "+ err + commentid
        });
      }
    } else{
      // cache.set(req.originalUrl, data);
      res.send(data);
    };
  });
};