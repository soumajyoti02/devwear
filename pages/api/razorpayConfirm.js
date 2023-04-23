import crypto from 'crypto';
import connectDb from "@/middleware/mongoose"
import Order from "@/models/Order"
import Product from '@/models/Product';

const handler = async (req, res) => {
    if (req.method === 'POST') {
        console.log(req.body)
        let order;

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body.response;
        const body = `${razorpay_order_id}|${razorpay_payment_id}`;
        const expectedSignature = crypto.createHmac('sha256', `${process.env.RAZORPAY_KEY_SECRET}`)
            .update(body.toString())
            .digest('hex');
        const response = { signatureIsValid: false, id: null };

        if (expectedSignature === razorpay_signature) {

            response.signatureIsValid = true;
            console.log(razorpay_payment_id)
            order = await Order.findOneAndUpdate({ orderId: razorpay_order_id }, { status: 'Paid', paymentInfo: JSON.stringify(req.body), transactionid: razorpay_payment_id })
            response.id = order._id;

            // Updating the available quantity in Database
            let products = order.products
            for (let slug in products) {
                await Product.findOneAndUpdate({ slug: slug }, { $inc: { "availableQty": - products[slug].qty } })
            }
        }

        res.status(200).json(response);
    } else {
        res.status(404).send('Not Found');
    }
}


export default connectDb(handler) 