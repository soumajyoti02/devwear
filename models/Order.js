// Import the Mongoose library
const mongoose = require('mongoose')

// Define the schema for an order
const OrderSchema = new mongoose.Schema({
    userId: { type: String, required: true }, // User ID for the order
    products: [{ // Array of products in the order
        productId: { type: String }, // Product ID for the product
        quantity: { type: Number, default: 1 } // Quantity of the product in the order
    }],
    address: { type: String, required: true }, // Address for the order
    amount: { type: Number, required: true }, // Total amount of the order
    status: { type: String, default: 'Pending', required: true }, // Status of the order (default is Pending)
}, { timestamps: true }) // Adds timestamps for when the order is created and modified

// Clear the models in Mongoose (in case any were previously defined)
mongoose.models = {}

// Export the schema as a Mongoose model called "Order"
export default mongoose.model("Order", OrderSchema)
