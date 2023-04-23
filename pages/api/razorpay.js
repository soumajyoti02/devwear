import Razorpay from 'razorpay';
import connectDb from "@/middleware/mongoose"
import Order from "@/models/Order"
import Product from '@/models/Product';
import pincodes from '../../pincodes.json'

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

            // console.log(instance)
            const order = await instance.orders.create(options);

            // Check if the PinCode is Servicable
            if (!Object.keys(pincodes).includes(req.body.userData.pincode)) {
                res.status(200).send({ success: false, 'error': 'PinCode you have entered is not servicable', cartClear: false })
                return
            }

            // Check if the cart is tampered with
            let product, sumTotal = 0
            let cart = req.body.userData.cart

            //To Give error if User want to place order of Rs. 0
            if (req.body.userData.subTotal <= 0) {
                res.status(200).send({ success: false, 'error': 'Cart is Empty! Please build your cart and Try again!', cartClear: true })
                return
            }

            for (let item in cart) {
                // console.log(item)
                sumTotal += cart[item].price * cart[item].qty
                product = await Product.findOne({ slug: item })

                // Check if the cart items are out of stock
                if (product.availableQty < cart[item].qty) {
                    res.status(200).send({ success: false, 'error': 'Some items in your cart went out of stock. Please Try again!', cartClear: true })
                    return
                }

                if (product.price != cart[item].price) {
                    res.status(200).send({ success: false, 'error': 'The price of some items in your cart have changed. Please try again', cartClear: true })
                    return
                }
            }
            if (sumTotal !== req.body.userData.subTotal) {
                res.status(200).send({ success: false, 'error': 'The price of some items in your cart have changed. Please try again', cartClear: true })
                return
            }

            // Check if the Details are Valid

            if (req.body.userData.phone.length !== 10 || !Number.isInteger(Number(req.body.userData.phone))) {
                res.status(200).send({ success: false, 'error': 'Please Enter Your 10 digit phone number!', cartClear: false })
                return
            }

            if (req.body.userData.pincode.length !== 6 || !Number.isInteger(Number(req.body.userData.pincode))) {
                res.status(200).send({ success: false, 'error': 'Please Enter Your 6 digit Pincode!', cartClear: false })
                return
            }

            //Initiate an Order, i.e. save the order in mongoDB
            let orders = new Order({
                email: req.body.userData.email,
                orderId: order.id,
                address: req.body.userData.address,
                amount: req.body.userData.subTotal,
                products: req.body.userData.cart,
            })
            await orders.save()

            // console.log(order)

            res.status(200).json({ success: true, orderId: order.id, cartClear: true });
        } catch (err) {
            console.error(err);
            res.status(500).send('Error creating order');
        }
    } else {
        res.status(404).send('error');
    }
}

export default connectDb(handler) 