
exports.createOrder = (req,res) => {
    const razorpay = new Razorpay({
        key_id: 'YOUR_KEY_ID',
        key_secret: 'YOUR_SECRET_KEY',
      });
      
      app.post(async (req, res) => {
        const { amount } = req.body;
        const options = {
          amount: amount * 100, 
          currency: 'INR',
          receipt: 'order_rcptid_11',
        };
        try {
          const order = await razorpay.orders.create(options);
          res.json(order);
        } catch (error) {
          res.status(500).send('Error creating order');
        }
      });
      
}

exports.verifyPayment = (req,res) => {
    app.post( (req, res) => {
        const { order_id, payment_id, signature } = req.body;
        const generatedSignature = crypto
          .createHmac('sha256', 'YOUR_SECRET_KEY')
          .update(`${order_id}|${payment_id}`)
          .digest('hex');
      
        if (generatedSignature === signature) {
          res.send({ status: 'success' });
        } else {
          res.send({ status: 'failure' });
        }
      });
}