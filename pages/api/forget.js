import Forget from "@/models/Forget"
import User from "@/models/User"
import connectDb from "@/middleware/mongoose"
import jsonwebtoken from "jsonwebtoken"

var CryptoJS = require("crypto-js");
import nodemailer from 'nodemailer';

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
                // console.log(token) // To be removed. [PENDING]


                let email = `Dear ${user.name},

We have received a request to reset your password for your account on devwear.com. To ensure the security of your account, we recommend that you reset your password as soon as possible.

Please follow the link below to reset your password securely:

${process.env.NEXT_PUBLIC_HOST}/forget?token=${token}

As a security precaution, this link will only be valid for a limited time. We also recommend that you take the following steps to further secure your account:

1. Use a strong and unique password that is not used for any other accounts.
2. Be Cautious with OTPs: Be cautious with One-Time Passwords (OTPs) and never share them with anyone.
3. If you did not initiate this password reset request, please contact us immediately at [Contact Information]. We take the security of our users' accounts very seriously, and we are here to help you in any way we can.

Thank you for choosing devwear.com! We appreciate your trust in us.

Warm regards,

Soumajyoti
Founder & CEO
Devwear.com
`

                const sendResetLink = async () => {
                    const transporter = nodemailer.createTransport({
                        host: 'smtp.gmail.com',
                        port: 587,
                        secure: false,
                        requireTLS: true,
                        auth: {
                            user: 'soumyabwn3@gmail.com',
                            pass: 'kuwxqxcbinnlhxbr',
                        },
                    });
                    let message = {
                        from: 'soumyabwn3@gmail.com',
                        to: user.email,
                        subject: ' Important: Reset Your Password',
                        text: email,
                    };

                    let info = transporter.sendMail(message, function (error, information) {
                        if (error) {
                            console.log(error)
                        }
                        else {
                            console.log('Message sent successfully as %s', info.messageId);
                        }
                    });
                }
                sendResetLink()
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