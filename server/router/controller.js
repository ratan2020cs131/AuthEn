const bcrypt = require("bcrypt");
const User = require('../db/userSchema');


//REGISTER
const Register = async (req, res) => {
    const { name, email, phone, password, cpassword, profileImage } = req.body;

    if (!name || !email || !phone || !password || !cpassword || !profileImage) {
        return res.status(422).json({ message: "pls fill the form" });
    }
    if (password != cpassword) {
        return res.status(423).json({ message: "password does not match" });
    }

    const userExist = await User.findOne({ phone });

    if (userExist) {
        return res.status(424).json({ message: "user already exist" });
    } else {
        const user = new User({ name, email, phone, password, profileImage });
        user.save().then(() => {
            res.status(201).json({ message: "user registered successfully" })
        }).catch(err => { res.status(500).json({ message: "Password must have atleast 8 characters" }) })
    }

}


//LOGIN
const Login = async (req, res) => {
    const { phone, password } = req.body;
    if (!phone) {
        return res.status(424).json({ message: "empty username field" });
    }
    if (!password) {
        return res.status(423).json({ message: "empty password field" });
    }

    const userExist = await User.findOne({ phone });

    if (userExist) {
        bcrypt.compare(password, userExist.password, (err, result) => {
            if (result) {
                userExist.generateAuthToken().then(function (token) {
                    res.cookie('jwtoken', token, {
                        expires: new Date(Date.now() + 86400000),
                        httpOnly: true
                    }).status(201).json(userExist);
                });
            }
            else {
                res.status(500).json({ message: "incorrect password" })
            }
        })
    } else {
        res.status(422).json({ message: "user does not exist" });
    }
}


//LOGOUT
const Logout = (req, res) => {

    req.rootUser.tokens = req.rootUser.tokens.filter((item) => {
        return item.token !== req.token
    })

    req.rootUser.save().then(() => {
        res.status(202).clearCookie('jwtoken').send({
            message: 'cookie cleared',
            status: 'logout successful'
        });

    })
}


//VERIFY
const Verify = (req, res) => {
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


//EDIT_PROFILE
const EditProfile = (req, res) => {
    const { _id, name, email, phone, profileImage } = req.body;
    User.findOne({ _id }).then(
        (userExist) => {
            User.findOne({ phone }).then((phoneExist) => {

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


//DELETE
const Delete = (req, res) => {
    const { pass } = req.body;
    bcrypt.compare(pass, req.rootUser.password, (err, result) => {
        if (result) {
            User.findOneAndDelete({ _id: req.user_id }).then(() => {
                res.status(202).clearCookie('jwtoken').send('cookie cleared');
            })
        }
        else {
            res.status(500).json({ message: 'incorrect password' });
        }
    });
}


//GET_DATA
const Getdata = (req,res) => {
    return res.status(200).send(req.rootUser);
}


module.exports = { Register, Login, Logout, Verify, EditProfile, Delete, Getdata };