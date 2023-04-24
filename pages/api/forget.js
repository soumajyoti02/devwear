import Forget from "@/models/Forget"
import User from "@/models/User"
import Product from "@/models/Product"
import connectDb from "@/middleware/mongoose"
import jsonwebtoken from "jsonwebtoken"

var CryptoJS = require("crypto-js");

var jwt = require('jsonwebtoken');

const handler = async (req, res) => {
    if (req.method = 'POST') {
        // Check if the user exists in the database

        //Send an email to the user
        if (req.body.sendMail) {

            let token = "1";
            let user = await User.findOne({ "email": req.body.email })

            if (user) {
                if (req.body.email == user.email) {
                    token = jwt.sign({ email: user.email, name: user.name }, process.env.JWT_SECRET, {
                        expiresIn: "2d"
                    });
                }

                let forget = new Forget({
                    userid: user._id,
                    email: req.body.email,
                    token: token,
                })
                await forget.save()
                console.log(token)


                let email = `We have sent you this email in response to your request to reset your password on Devwear.com
                To reset your password, please follow the link below:
                <a href="https://devwear.com/forget?token=${token}">Click Here to Reset Your Password</a>
                We recommend that you keep your password secure and not share it with anyone. If you feel your password has been compromised, you can change it by going to your My Account Page and change your password.`
            }

            res.status(200).json({ success: true })
            return
        }

        else {
            // Reset User Password
            let userFromForget = await Forget.findOne({ "token": req.body.token })
            if (userFromForget) {
                let token = userFromForget.token

                let user = jsonwebtoken.verify(token, process.env.JWT_SECRET)
                let dbuser = await User.findOne({ email: user.email })

                if (req.body.password == req.body.cpassword) {
                    await User.findOneAndUpdate({ email: dbuser.email }, { password: CryptoJS.AES.encrypt(req.body.cpassword, process.env.AES_SECRET).toString() })

                    res.status(200).json({ success: true })
                    return
                }
                else {
                    res.status(400).json({ success: false, error: "Password Not Matched!" })
                    return
                }
            }
            else {
                res.status(400).json({ success: false, error: "User not Found" })
                return
            }
        }
    }

    else {
        res.status(400).json({ error: "This method is not allowed" })
    }
}

export default connectDb(handler)   