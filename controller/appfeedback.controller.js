const AppFeedback = require('../models/appfeedback.model')

exports.create =  (req, res) => {
    AppFeedback.create(req.body, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `not found`
          });
        } else {
          res.status(500).send({
            message: "Error creating feedback "
          });
        }
      } else res.send(data);
    });
  };