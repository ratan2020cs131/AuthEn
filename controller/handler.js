const nodemailer = require('nodemailer');
const User = require('../db/userSchema');
const jwt = require("jsonwebtoken");

const forgotPass = async (req, res) => {
    const { email } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
        const token = await userExist.generatePassToken();

        const transporter = nodemailer.createTransport({
            port: 465,
            secure: true,
            service: 'Gmail',
            auth: {
                user: process.env.USER_MAIL,
                pass: process.env.NODEMAILER_KEY,
            },
        });

        const mailOptions = {
            from: '"AuthEn" ratandeep.blr.12@gmail.com',
            to: `${email}`,
            subject: 'Reset Password',
            html: `
            <div>
                <p style="font-family:open sans;"> Hi <b>Ratan</b>,</p>
                <div>
                    <p style="font-family:open sans;">Its okay we are here to help you, please click the follwoing button to reset your password<p>
                    <a href="http://localhost:5000/reset-password/${token}"
                        style="font-family:open sans;
                        display:inline-block;
                        text-decoration:none;
                        background: rgb(28,130,154);
                        background: linear-gradient(169deg, rgba(28,130,154,1) 48%, rgba(60,56,112,1) 72%);
                        color:white;
                        padding: 5px 15px;
                        border-radius:3px;
                        font-weight:bold;
                        font-size:20px;"
                    >
                        RESET PASSWORD
                    </a>
                </div>
            </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);

        if (info) {
            return res.status(200).send({ message: "Reset link sent" });
        }

    } else {
        return res.status(404).json({ message: "User does not exist" });
    }
}


const verifyToken = async (req, res) => {
    try {
        const token = req.params['token'];

        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ _id: verifyToken._id });
        if (!user) { throw new Error('User not found'); }

        if (user.resetPass === token) {
            res.redirect(`https://authen-two.vercel.app/reset-password/${token}`);
        } else {
            throw new Error('Token Expired');
        }
    }
    catch (err) {
        res.status(401).send({ message: 'Unauthorised' });
    }
}

const resetPassword = async (req, res) => {
    try {
        const token = req.params['token'];
        const { password } = req.body;
        const verifyToken = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findOne({ _id: verifyToken._id });
        if (!user) { throw new Error('User not found'); }
        if (user.resetPass === token) {
            user.resetPass = "";
            user.password = password;
            await user.save();
            res.status(200).send({ message: "Password updated" })
        }
        else {
            res.status(400).send({ message: "Token already used" })
        }
    }
    catch (error) {
        res.status(401).send({ message: 'Unauthorised' });
    }
}


module.exports = { forgotPass, verifyToken, resetPassword };