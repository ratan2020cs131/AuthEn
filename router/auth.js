const express=require("express");
const bcrypt=require("bcrypt");
const router =express.Router();
const jwt = require("jsonwebtoken");

const Authenticate = require('../middleware/Authenticate')

require('../db/conn');
const User=require('../db/userSchema');




router.post('/register',(req,res)=>{
    const {name,email,phone,password,cpassword, profileImage} = req.body;

    if(!name || !email || !phone || !password || !cpassword || !profileImage){
        return res.status(422).json({message:"pls fill the form"});
    }
    if(password!=cpassword){
        return res.status(423).json({message:"password does not match"});
    }
    User.findOne({phone:phone}).then(
        (userExist)=>{
            if(userExist){
                return res.status(424).json({message:"user already exist"});
            }

            const user = new User({name,email,phone,password, profileImage});

            user.save().then(()=>{
                res.status(201).json({message:"user registered successfully"})
            }).catch(err=>{res.status(500).json({message:"Password must have atleast 8 characters"})})
        }
    ).catch(err=>{console.log(err)});
})

router.post('/login',(req,res)=>{
    const {phone, password} = req.body;
    if(!phone){
        return res.status(424).json({message:"empty username field"});
    }
    if(!password){
        return res.status(423).json({message:"empty password field"});
    }
    User.findOne({phone:phone}).then(
        (userExist)=>{
            bcrypt.compare(password, userExist.password,(err,result)=>{
                if(result){
                    userExist.generateAuthToken().then(function (token){
                        res.cookie('jwtoken',token,{
                            expires:new Date(Date.now()+86400000),
                            httpOnly:true
                        }).status(201).json({message:"login successfully"});
                    });
                }
                else{
                    res.status(500).json({message:"incorrect password"})
                }
            })
        }
    ).catch(err=>{res.status(422).json({message:"user does not exist"});})
})

router.get('/getData',Authenticate, (req,res)=>{
    res.status(200).send(req.rootUser);
})

router.get('/logout',Authenticate, (req,res)=>{
    res.clearCookie('jwtoken',{path:'/'});
    req.rootUser.tokens=req.rootUser.tokens.filter((item)=>{
        return item.token!==req.token
    })
    req.rootUser.save().then(()=>{
        res.status(200).json({message:'User logged out'});
    })
})

router.post('/verify', Authenticate, (req,res)=>{
    const {pass}=req.body;
    bcrypt.compare(pass, req.rootUser.password,(err,result)=>{
        if(result){
            res.status(200).send(req.rootUser);
        }
        else{
            res.status(500).json({message:'incorrect password'});
        }
    });
})

router.post('/editprofile', (req, res) => {
    const {_id, name, email, phone, profileImage} = req.body;
    User.findOne({_id:_id}).then(
        (userExist)=>{
            User.findOne({phone: phone}).then((phoneExist)=>{
                if(phoneExist){
                    res.status(501).json({message:"phone number is already registered"});
                }
                else{
                    userExist.name=name;
                    userExist.email=email;
                    userExist.phone=phone;
                    userExist.profileImage=profileImage;
        
                    userExist.save().then(()=>{
                        res.status(201).json({message:"profile updated"});
                    })
                    .catch(error=>{res.status(500).json({message:"error updating"})})

                }
            })
    }).catch(err=>{console.log(err)});
})

router.post('/delete', Authenticate, (req,res)=>{
    const {pass}=req.body;
    bcrypt.compare(pass, req.rootUser.password,(err,result)=>{
        if(result){
            User.findOneAndDelete({_id:req.user_id}).then(()=>{
                res.clearCookie('jwtoken',{path:'/'});
                res.status(200).json({message:'Account Deleted'});
            })
        }
        else{
            res.status(500).json({message:'incorrect password'});
        }
    });
})



module.exports = router;