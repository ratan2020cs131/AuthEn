const User = require('../db/userSchema');
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


const signupHandler = async (req, res) => {
    const { name, email, phone, password, cpassword, profileImage } = req.body;

    if (!name || !email || !phone || !password || !cpassword ) {
        return res.status(422).json({ message: "Please fill the form" });
    }
    if (password != cpassword) {
        return res.status(423).json({ message: "Passwords do not match" });
    }
    User.findOne({ phone: phone }).then(
        (userExist) => {
            if (userExist) {
                return res.status(424).json({ message: "User already exist" });
            }

            const user = new User({ name, email, phone, password, profileImage });

            user.save().then(() => {
                res.status(201).json({ message: "User registered successfully" })
            }).catch(err => { res.status(500).json({ message: "Password must have atleast 8 characters" }) })
        }
    ).catch(err => { console.log(err) });
}


const loginHandler = async (req, res) => {
    const { phone, password } = req.body;
    if (!phone) {
        return res.status(424).json({ message: "Enter username" });
    }
    if (!password) {
        return res.status(423).json({ message: "Enter password" });
    }
    User.findOne({ phone: phone }).then(
        (userExist) => {
            bcrypt.compare(password, userExist.password, (err, result) => {
                if (result) {
                    userExist.generateAuthToken().then(function (token) {
                        res.cookie('jwtoken', token, {
                            expires: new Date(Date.now() + 86400000),
                            httpOnly: true
                        }).status(201).json({ message: "Login successfully" });
                    });
                }
                else {
                    res.status(401).json({ message: "Incorrect password" })
                }
            })
        }
    ).catch(err => { res.status(422).json({ message: "User does not exist" }); })
}


const logoutHandler = async (req, res) => {
    req.rootUser.tokens = req.rootUser.tokens.filter((item) => {
        return item.token !== req.token
    })
    req.rootUser.save().then(() => {
        res.status(202).clearCookie('jwtoken').json({message:'cookie cleared'});
    })
}


const deleteAcc = async (req, res) => {
    const { pass } = req.body;
    bcrypt.compare(pass, req.rootUser.password, (err, result) => {
        if (result) {
            User.findOneAndDelete({ _id: req.user_id }).then(() => {
                res.clearCookie('jwtoken', { path: '/' });
                res.status(200).json({ message: 'Account Deleted' });
            })
        }
        else {
            res.status(500).json({ message: 'incorrect password' });
        }
    });
}


const verifyPass = async (req, res) => {
    const { pass } = req.body;
    bcrypt.compare(pass, req.rootUser.password, (err, result) => {
        if (result) {
            res.status(200).send(req.rootUser);
        }
        else {
            res.status(500).json({ message: 'incorrect password' });
        }
    });
}


const editProfile = async (req, res) => {
    const { _id, name, email, phone, profileImage } = req.body;
    User.findOne({ _id: _id }).then(
        (userExist) => {
            User.findOne({ phone: phone }).then((phoneExist) => {

                if (phoneExist && phoneExist.phone !== userExist.phone) {
                    res.status(501).json({ message: "phone number is already registered" });
                }
                else {
                    userExist.name = name;
                    userExist.email = email;
                    userExist.phone = phone;
                    userExist.profileImage = profileImage;

                    userExist.save().then(() => {
                        res.status(201).json({ message: "profile updated" });
                    })
                        .catch(error => { res.status(500).json({ message: "error updating" }) })

                }
            })
        }).catch(err => { console.log(err) });
}


const forgotPass = async (req, res) => {
    const { email } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
        const token = await userExist.generatePassToken();

        const transporter = nodemailer.createTransport({
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
                <p style="font-family:open sans;"> Hi <b>${userExist.name}</b>,</p>
                <div>
                    <p style="font-family:open sans;">Its okay we are here to help you, please click the follwoing button to reset your password<p>
                    <a href="https://authen-two.vercel.app/verify-pass-token/${token}"
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


module.exports = {
    forgotPass,
    verifyToken,
    resetPassword,
    deleteAcc,
    loginHandler,
    logoutHandler,
    verifyPass,
    editProfile,
    signupHandler
};
