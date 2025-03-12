const connection = require("../config/mysql.db.config");

// constructor
const Organization = function (organization) {
  this.org_name = organization.org_name;
  this.subdomain = organization.subdomain;
  this.email = organization.email;
  this.phone_no = organization.phone_no;
  this.address = organization.address;
  this.org_logo = organization.org_logo;
  // this.created_date = organization.created_date;
  this.created_by = organization.created_by;
  this.modified_by = organization.modified_by;
  // this.modified_date = organization.modified_date;
  this.status = organization.status;
};

Organization.create = (newOrganization, result) => {
  const query = `
    INSERT INTO organization 
    (org_name, subdomain, email, phone_no, address, org_logo, created_by, modified_by , status) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    newOrganization.org_name,
    newOrganization.subdomain,
    newOrganization.email,
    newOrganization.phone_no,
    newOrganization.address,
    newOrganization.org_logo,
    1,
    1,
    2,
  ];

  connection.query(query, values, (error, res) => {
    if (error) {
      console.error("Error inserting organization:", error);
      return result(error, null);
    }
    console.log("Organization inserted successfully:", res);
    result(null, { id: res.insertId, ...newOrganization });
  });
};

Organization.getOrganizations = async (result) => {
  connection.query(
    `SELECT * FROM organization ORDER BY created_date DESC;
  `,
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      }

      // not found user with the id
      result({ kind: "not_found" }, null);
    }
  );
};

Organization.updateApproval = async (status, id, result) => {
  connection.query(
    `UPDATE organization SET status = ? WHERE id = ?;
  `,
    [status, id],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      if (res.length) {
        result(null, res);
        return;
      }

      // not found user with the id
      result({ kind: "not_found" }, null);
    }
  );
};

module.exports = Organization;
