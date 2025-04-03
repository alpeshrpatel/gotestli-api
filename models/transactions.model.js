const connection = require("../config/mysql.db.config");

// constructor
const Transactions = function (transactions) {
  this.payment_intent_id = transactions.payment_intent_id;
  this.questionset_id = transactions.questionset_id;
  this.status = transactions.status;
  this.is_delete = transactions.is_delete;
  this.user_id = transactions.user_id;
  this.amount = transactions.amount;
  this.org_id = transactions.org_id;
};

Transactions.create = (newTransactions, result) => {
  const query =
    "INSERT INTO transactions (payment_intent_id,amount,status,user_id,questionset_id,org_id,is_delete) values (?,?,?,?,?,?,?); ";
  connection.query(
    query,
    [
      newTransactions.payment_intent_id,
      newTransactions.amount,
      newTransactions.status,
      newTransactions.user_id,
      newTransactions.questionset_id,
      newTransactions.org_id,
      newTransactions.is_delete
    ],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, { id: res.insertId, ...newTransactions });
    }
  );
};

// Transactions.getMyPayments = async (id,startPoint, endPoint, result) => {
//   const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
//   const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;

//   const limit = Math.max(parseInt(end - start + 1, 10), 1);
//   const offset = Math.max(parseInt(start - 1, 10), 0);
//   let queryString = '';
//   let queryParams = [];
//   if(id !== 0){
//     queryString  = `SELECT t.id, t.payment_intent_id, t.amount,t.status,t.user_id,t.org_id,t.questionset_id,t.created_date, qs.title, u.email, u.first_name FROM transactions t JOIN question_set qs ON t.questionset_id = qs.id JOIN users u ON t.user_id = u.id where t.user_id = ? ORDER BY t.created_date DESC LIMIT ? OFFSET ?;`
//   }else {
//     queryString  = `SELECT t.id, t.payment_intent_id, t.amount,t.status,t.user_id,t.org_id,t.questionset_id,t.created_date, qs.title, u.email, u.first_name FROM transactions t JOIN question_set qs ON t.questionset_id = qs.id JOIN users u ON t.user_id = u.id  ORDER BY t.created_date DESC LIMIT ? OFFSET ?;`
//   }
//   if(id !== 0){
//     queryParams = [id,limit,offset];
//   }else{
//     queryParams = [limit,offset];
//   }
//   connection.query(
//     queryString,queryParams,
//     (err, res) => {
//       if (err) {
//         result(err, null);
//         return;
//       }
//       try {
//         // const [countResult] = await connection.execute(
//         //   "SELECT COUNT(*) as total FROM question_master WHERE created_by = ?",
//         //   [id]
//         // );
//         // const totalRecords = countResult[0].total;
//         let countQuery = ''
//         let countParams = []
//         if(id !== 0){
//           countQuery = "SELECT COUNT(*) as total FROM transactions t JOIN question_set qs ON t.questionset_id = qs.id where t.user_id = ?";
//         }else{
//           countQuery = "SELECT COUNT(*) as total FROM transactions t JOIN question_set qs ON t.questionset_id = qs.id"
//         }
//         if(id !== 0){
//           countParams = [id];
//         }else {
//           countParams = [];
//         }
//         connection.query(
//           countQuery,
//           countParams,
//           (countErr, countRes) => {
//             if (countErr) {
//               result(countErr, null);
//               return;
//             }

//             const totalRecords = countRes[0]?.total || 0;
//             result(null, { res, totalRecords });
//             return;
//           }
//         );

//         // result(null, {
//         //   data: res,
//         //   totalRecords,
//         // });
//       } catch (error) {
//         result(error, null);
//       }
//     //   if (res.length) {
//     //     result(null, res);
//     //     return;
//     //   }

//       // not found user with the id
//     //   result({ kind: "not_found" }, null);
//     }
//   );
// };
Transactions.getAllPayments = async (id, startPoint, endPoint, result) => {
  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;
  
  const limit = Math.max(parseInt(end - start + 1, 10), 1);
  const offset = Math.max(parseInt(start - 1, 10), 0);
  
 
  const queryString = `
    SELECT t.id, t.payment_intent_id, t.amount, t.status, t.user_id, t.org_id, 
           t.questionset_id, t.created_date, 
           qs.title, 
           u.email, u.first_name 
    FROM transactions t 
    LEFT JOIN question_set qs ON t.questionset_id = qs.id 
    LEFT JOIN users u ON t.user_id = u.id 
    WHERE t.is_delete = 0
    ORDER BY t.created_date DESC 
    LIMIT ? OFFSET ?`;
  
  const queryParams = [limit, offset];
  
  console.log("Executing query:", queryString);
  console.log("With params:", queryParams);
  
  connection.query(
    queryString, queryParams,
    (err, res) => {
      if (err) {
        console.error("Query error:", err);
        result(err, null);
        return;
      }
      
      console.log("Query result count:", res?.length);
      
      connection.query(
        "SELECT COUNT(*) as total FROM transactions WHERE is_delete = 0",
        [],
        (countErr, countRes) => {
          if (countErr) {
            console.error("Count error:", countErr);
            result(countErr, null);
            return;
          }
          
          const totalRecords = countRes[0]?.total || 0;
          console.log("Total records:", totalRecords);
          result(null, { res, totalRecords });
        }
      );
    }
  );
};

Transactions.getMyPayments = async (id, startPoint, endPoint, result) => {
  const start = Number.isInteger(Number(startPoint)) ? Number(startPoint) : 1;
  const end = Number.isInteger(Number(endPoint)) ? Number(endPoint) : 10;
  
  const limit = Math.max(parseInt(end - start + 1, 10), 1);
  const offset = Math.max(parseInt(start - 1, 10), 0);
  
 
  const queryString = `
    SELECT t.id, t.payment_intent_id, t.amount, t.status, t.user_id, t.org_id, 
           t.questionset_id, t.created_date, 
           qs.title, 
           u.email, u.first_name 
    FROM transactions t 
    LEFT JOIN question_set qs ON t.questionset_id = qs.id 
    LEFT JOIN users u ON t.user_id = u.id 
    WHERE t.user_id = ${id} and t.is_delete = 0
    ORDER BY t.created_date DESC 
    LIMIT ? OFFSET ?`;
  
  const queryParams = [limit, offset];
  
  console.log("Executing query:", queryString);
  console.log("With params:", queryParams);
  
  connection.query(
    queryString, queryParams,
    (err, res) => {
      if (err) {
        console.error("Query error:", err);
        result(err, null);
        return;
      }
      
      console.log("Query result count:", res?.length);
      
      connection.query(
        "SELECT COUNT(*) as total FROM transactions WHERE user_id = id and is_delete = 0",
        [],
        (countErr, countRes) => {
          if (countErr) {
            console.error("Count error:", countErr);
            result(countErr, null);
            return;
          }
          
          const totalRecords = countRes[0]?.total || 0;
          console.log("Total records:", totalRecords);
          result(null, { res, totalRecords });
        }
      );
    }
  );
};

Transactions.refundPaymentUpdate = (is_delete,payment_intent_id, result) => {
  const query =
    "UPDATE transactions SET is_delete = ? WHERE payment_intent_id = ? ; ";
  connection.query(
    query,
    [
      is_delete, payment_intent_id
    ],
    (err, res) => {
      if (err) {
        result(err, null);
        return;
      }

      result(null, { id: res.insertId });
    }
  );
};

module.exports = Transactions;
