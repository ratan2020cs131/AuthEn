const express=require("express");
const router =express.Router();

const Authenticate = require('../middleware/Authenticate')
const {
    Register,
    Login,
    Logout,
    Verify,
    EditProfile,
    Delete,
    Getdata
} = require('./controller');


router.post('/register', Register);
router.post('/login', Login);
router.get('/logout', Authenticate, Logout);
router.post('/verify', Authenticate, Verify);
router.post('/delete', Authenticate, Delete);
router.post('/editprofile', EditProfile);
router.get('/getData', Authenticate, Getdata);


module.exports = router;