const { cache } = require("../middleware/cacheMiddleware");
const Organization = require("../models/organization.model");
const generateDateTime = require("../utils/util");

// Create and Save a new Organization
exports.create = (req, res) => {
  // Validate request

  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    });
  }
  let parts = req.body.websiteUrl.split(".");

  // If there's a 'www', remove it
  if (parts.length > 2 && parts[0] === "www") {
    parts.shift(); // Remove 'www'
  }

  const data = {
    org_name: req.body.organizationName,
    email: req.body.email,
    phone_no: req.body.phoneNumber,
    org_logo: req.body.logoUrl,
    address: req.body.address,
    subdomain: parts[0]
  };
  //   const createdDate = generateDateTime();
  // Save Organization in the database
  Organization.create(data, (err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Organization.",
      });
    else res.send(data);
  });
};

exports.getOrganizations = (req, res) => {
  Organization.getOrganizations( (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found organization.`,
        });
      } else {
        res.status(500).send({
          message: "Error retrieving organization ",
        });
      }
    } else {
      // cache.set(req.originalUrl, data);
      res.send(data);
    }
  });
};

exports.updateApproval = (req, res) => {
  const status = req.body.approval;
  const id = req.body.orgId;
  Organization.updateApproval(status,id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: `Not found organization.`,
        });
      } else {
        res.status(500).send({
          message: "Error updating organization status ",
        });
      }
    } else {
      // cache.set(req.originalUrl, data);
      res.send(data);
    }
  });
};
