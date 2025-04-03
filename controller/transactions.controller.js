const { cache } = require("../middleware/cacheMiddleware");
const Transactions = require("../models/transactions.model");
const generateDateTime = require("../utils/util");
const stripe = require('stripe')('sk_test_51QoP1kCc5nEXg12i23DtMBNpLgHEHT4tTIGt6At1JA1KmdnNVdidYLL7SqSfZfwsvFUMPjPbUk4Q3B2TV7oqt2ZH00mLQDT77K');

// Create and Save a new Transactions
exports.create = (req, res) => {
      // Validate request
       
      if (!req.body) {
        res.status(400).send({
          message: "Content can not be empty!"
        });
      }
      const data = {questionset_id:req.body.questionSetId,user_id:req.body.userId,org_id:req.body.orgId,amount:req.body.amount,payment_intent_id:req.body.paymentIntentId,is_delete:req.body.isDelete,status: req.body.status}
    //   const createdDate = generateDateTime();
      // Save Transactions in the database
      Transactions.create(data , (err, data) => {
        if (err)
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the Transactions."
          });
        else res.send(data);
      });
};

exports.getAllPayments =  (req, res) => {
    const { start, end } = req.query;
//   const {orgid} = req.query;
console.log(req.params.userid)
    Transactions.getAllPayments(req.params.userid,start,end, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
           
          res.send({
            message: `Not found transaction with id ${req.params.userid}.`
          });
        } else {
            console.log(err)
          res.status(500).send({
            message: "Error retrieving transaction with id " + req.params.userid
          });
        }
      } else{
        // cache.set(req.originalUrl, data);
        res.send(data);
      };
    });
  };
  exports.getMyPayments =  (req, res) => {
    const { start, end } = req.query;
//   const {orgid} = req.query;
console.log(req.params.userid)
    Transactions.getMyPayments(req.params.userid,start,end, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
           
          res.send({
            message: `Not found transaction with id ${req.params.userid}.`
          });
        } else {
            console.log(err)
          res.status(500).send({
            message: "Error retrieving transaction with id " + req.params.userid
          });
        }
      } else{
        // cache.set(req.originalUrl, data);
        res.send(data);
      };
    });
  };

exports.getReceipt  =   async (req, res) => {
    try {
      const { paymentIntentId } = req.params;
      
      // Fetch the payment intent from Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      // You might also want to fetch the charge or invoice for more details
      const charge = await stripe.charges.retrieve(paymentIntent.latest_charge);
      
      // Send receipt data back to the client
      res.json({
        status: 'success',
        receipt: {
          id: paymentIntent.id,
          amount: paymentIntent.amount / 100, // Convert from cents
          currency: paymentIntent.currency,
          date: new Date(paymentIntent.created * 1000).toISOString(),
          paymentMethod: charge.payment_method_details.type,
          receiptUrl: charge.receipt_url, // Stripe provides a hosted receipt URL
          // Add any other fields you need
        }
      });
    } catch (error) {
      console.error('Error fetching receipt:', error);
      res.status(500).json({ status: 'error', message: error.message });
    }
  }

  exports.refundPaymentUpdate = (req, res) => {
    // Validate Request
  
    Transactions.refundPaymentUpdate(
      req.body.is_delete,
      req.params.paymentIntentId,
      (err, data) => {
        if (err) {
          if (err.kind === "not_found") {
            res.status(404).send({
              message: `Not found transaction with id ${req.params.paymentIntentId}.`,
            });
          } else {
            res.status(500).send({
              message: "Error updating transaction with id " + req.params.paymentIntentId,
            });
          }
        } else{
          cache.set(req.originalUrl, data);
          res.send(data);
        };
      }
    );
  };