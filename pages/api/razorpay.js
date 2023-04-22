{/*

// const express = require('express')
// const app = express()
// const port = 3000
// const bodyparser = require("body-parser")
// const Razorpay = require('razorpay')
// app.use(require("body-parser").json())

// const instance = new Razorpay({
//     key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET,
// });

// app.get('/', (req, res) => {
//     res.sendFile("checkout.js", { root: _dirname })
// })

// app.post(`${process.env.NEXT_PUBLIC_HOST}/create/orderId`, (req, res) => {
//     console.log("create orderId request")
//     const options = {
//         amount: req.amount,  // amount in the smallest currency unit
//         currency: "INR",
//         receipt: "rcp1"
//     }
//     instance.orders.create(options, (err, order) => {
//         console.log(order.id);
//         res.send({ orderId: order.id })
//     });
// })

// app.post("/api/payment/verify", (req, res) => {

//     let body = req.body.response.razorpay_order_id + "|" + req.body.response.razorpay_payment_id;

//     const crypto = require("crypto");
//     const expectedSignature = crypto.createHmac('sha256', `${process.env.RAZORPAY_KEY_SECRET}`)
//         .update(body.toString())
//         .digest('hex');
//     // console.log("sig received ", req.body.response.razorpay_signature);
//     // console.log("sig generated ", expectedSignature);
//     const response = { "signatureIsValid": "false" }
//     if (expectedSignature === req.body.response.razorpay_signature)
//         response = { "signatureIsValid": "true" }
//     res.send(response);
// });

// app.listen(port, () => {
//     console.log(`Devwear listening at http://localhost:${port}`)
// })

*/}

import Razorpay from 'razorpay';
import connectDb from "@/middleware/mongoose"
import Order from "@/models/Order"

const handler = async (req, res) => {
    const instance = new Razorpay({
        key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    if (req.method === 'POST') {

        try {
            const options = {
                amount: (req.body.userData.subTotal * 100) + 200,
                currency: 'INR',
                receipt: 'receipt',
            };
            const order = await instance.orders.create(options);

            // console.log(order.id);
            // console.log(req.body.userData.subTotal);
            // console.log(req.body.userData);
            // console.log(req.body.userData.email);
            // console.log(req.body.userData.address);

            // Check if the cart is tampered with

            // Check if the cart items are out of stock

            // Check if the Details are Valid

            //Initiate an Order
            let orders = new Order({
                email: req.body.userData.email,
                orderId: order.id,
                address: req.body.userData.address,
                amount: req.body.userData.subTotal,
                products: req.body.userData.cart,
            })
            await orders.save()

            console.log(order)

            res.status(200).json({ orderId: order.id });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error creating order');
        }
    } else {
        res.status(404).send('error');
    }
}

export default connectDb(handler) 