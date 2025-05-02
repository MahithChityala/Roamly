const express = require('express');
const router = express.Router({mergeParams:true});
const User = require('../models/user.js');
const passport = require('passport');
const Listing=require('./listing.js');
const {saveRedirectUrl}=require('../middleware.js');

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",async(req,res,next)=>{
    try{
        const {username,password,email}=req.body;
        const newUser=new User({username,email});
        const registeredUser=await User.register(newUser,password);
        console.log(registeredUser); 
        req.login(registeredUser,(err)=>{
            if(err){
                 return next(err);
            }
            req.flash("success","Welcome to Wanderlust!");
        res.redirect("/listings");
        });
    }catch(e){
        req.flash("error",e.message);
        res.redirect("/signup");
    }
});

router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}),async(req,res)=>{
    req.flash("success","Welcome back!");
    res.redirect(res.locals.redirectUrl || "/listings");
});

router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        req.flash("success","Goodbye!");
        res.redirect("/listings");
    });
});

module.exports=router;