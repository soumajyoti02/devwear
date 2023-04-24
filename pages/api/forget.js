import Forget from "@/models/Forget"
import User from "@/models/User"
import connectDb from "@/middleware/mongoose"
import jsonwebtoken from "jsonwebtoken"

var CryptoJS = require("crypto-js");

var jwt = require('jsonwebtoken');

const handler = async (req, res) => {
    if (req.method = 'POST') {

        //Send an email to the user if sendMail = true i.e. user clicks on sendResetEmail button
        if (req.body.sendMail) {

            let token = "";

            // Check if the user exists in the database
            let user = await User.findOne({ "email": req.body.email })

            if (user) {
                if (req.body.email == user.email) {
                    // Generate a token to use it as query to reset password
                    token = jwt.sign({ email: user.email, name: user.name }, process.env.JWT_SECRET, {
                        expiresIn: "2d"
                    });
                }
                // Created a forget entry inside Database
                let forget = new Forget({
                    userid: user._id,
                    email: req.body.email,
                    token: token,
                })
                await forget.save()
                console.log(token) // To be removed. [PENDING]


                let email = `We have sent you this email in response to your request to reset your password on Devwear.com
                To reset your password, please follow the link below:
                <a href="https://devwear.com/forget?token=${token}">Click Here to Reset Your Password</a>
                We recommend that you keep your password secure and not share it with anyone. If you feel your password has been compromised, you can change it by going to your My Account Page and change your password.`
            }

            res.status(200).json({ success: true })
            return
        }

        //Reset the password if sendMail = fakse i.e. user clicks on resetPassword button
        else {
            // Reset User Password
            // Find the user w.r.t. token entered in query. To check if user tempered the token of query or not.
            let userFromForget = await Forget.findOne({ "token": req.body.token })


            if (userFromForget) {
                // Extract token from userFromForget object
                let token = userFromForget.token;

                // Verify the token using the JWT_SECRET environment variable
                let user = jsonwebtoken.verify(token, process.env.JWT_SECRET);

                // Find user in database using the email from the token
                let dbuser = await User.findOne({ email: user.email });

                // Check if the new password and confirm password match
                if (req.body.password == req.body.cpassword) {
                    // Encrypt the new password using the AES_SECRET environment variable
                    await User.findOneAndUpdate(
                        { email: dbuser.email },
                        { password: CryptoJS.AES.encrypt(req.body.cpassword, process.env.AES_SECRET).toString() }
                    );

                    // Return a success response if the password was updated successfully
                    res.status(200).json({ success: true });
                    return;
                } else {
                    // Return an error response if the new password and confirm password do not match
                    res.status(400).json({ success: false, error: "Password Not Matched!" });
                    return;
                }
            }

            else {
                res.status(400).json({ success: false, error: "User not Found" })
                return
            }
        }
    }

    else {
        res.status(400).json({ success: false, error: "This method is not allowed" })
    }
}

export default connectDb(handler)   