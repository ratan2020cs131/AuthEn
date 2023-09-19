const express = require("express");
const router = express.Router();
const Authenticate = require('../middleware/Authenticate')
const {
    forgotPass,
    verifyToken,
    resetPassword,
    deleteAcc,
    loginHandler,
    logoutHandler,
    verifyPass,
    editProfile,
    signupHandler
} = require('../controller/handler');


router.get('/getData', Authenticate, (req, res) => {
    res.status(200).send(req.rootUser);
})

router.post('/register', signupHandler)
router.post('/login', loginHandler)
router.get('/logout', Authenticate, logoutHandler);
router.post('/verify', Authenticate, verifyPass);
router.post('/editprofile', editProfile);
router.post('/delete', Authenticate, deleteAcc);
router.post('/forgot-password', forgotPass);
router.get('/verify-pass-token/:token', verifyToken);
router.post('/reset-password/:token', resetPassword);

module.exports = router;