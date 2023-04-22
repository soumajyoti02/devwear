// Import the Mongoose library
const mongoose = require('mongoose')

// Define the schema for an order
const OrderSchema = new mongoose.Schema({
    email: { type: String, required: true }, // User ID for the order
    orderId: { type: String, required: true },
    paymentInfo: { type: String, default: '' },
    products: { type: Object, required: true },
    address: { type: String, required: true }, // Address for the order
    amount: { type: Number, required: true }, // Total amount of the order
    status: { type: String, default: 'Initiated', required: true }, // Status of the order (default is Pending)
}, { timestamps: true }) // Adds timestamps for when the order is created and modified


export default mongoose.models.Order || mongoose.model("Order", OrderSchema)
