const express = require('express')
const app = express()
const port = 3000
const bodyparser = require("body-parser")
const Razorpay = require('razorpay')
app.use(require("body-parser").json())

const instance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

app.get('/', (req, res) => {
    res.sendFile("checkout.js", { root: _dirname })
})

app.post('/create/orderId', (req, res) => {
    console.log("create orderId request", req.body)
    const options = {
        amount: 100,  // amount in the smallest currency unit
        currency: "INR",
        receipt: "rcp1"
    };
    instance.orders.create(options, function (err, order) {
        console.log(order.id);
        res.send({ orderId: order.id })
    });
})

app.post("/api/payment/verify", (req, res) => {

    let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

    const crypto = require("crypto");
    const expectedSignature = crypto.createHmac('sha256', `${process.env.RAZORPAY_KEY_SECRET}`)
        .update(body.toString())
        .digest('hex');
    console.log("sig received ", req.body.response.razorpay_signature);
    console.log("sig generated ", expectedSignature);
    const response = { "signatureIsValid": "false" }
    if (expectedSignature === req.body.response.razorpay_signature)
        response = { "signatureIsValid": "true" }
    res.send(response);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})