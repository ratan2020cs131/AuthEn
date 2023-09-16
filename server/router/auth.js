const express=require("express");
const router =express.Router();

const Authenticate = require('../middleware/Authenticate')
const {
    Register,
    Login,
    Logout,
    Verify,
    EditProfile,
    Delete
} = require('./controller');


router.post('/register', Register);
router.post('/login', Login);
router.get('/logout', Authenticate, Logout);
router.post('/verify', Authenticate, Verify);
router.post('/delete', Authenticate, Delete);
router.post('/editprofile', EditProfile);
router.get('/getData',Authenticate, (req,res)=>res.status(200).send(req.rootUser));


module.exports = router;