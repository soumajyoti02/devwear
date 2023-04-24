const mongoose = require('mongoose')

const ForgetSchema = new mongoose.Schema({
    userid: { type: String, required: true },
    email: { type: String, required: true },
    token: { type: String, required: true },
}, { timestamps: true })


export default mongoose.models.Forget || mongoose.model("Forget", ForgetSchema)
// mongoose.models = {}
// export default mongoose.model("User", UserSchema)