const express = require('express');
const router = express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {ListingSchema,reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");

const validateListing=(req,res,next)=>{
    const {error}=ListingSchema.validate(req.body);
    if(error) {
        let errMsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(errMsg,400);
    }else{
        next();
    }
};

//index route
router.get("/",async (req,res)=>{
    const allListings=await Listing.find();
    res.render("listings/index.ejs",{allListings});
});

//new listing route
router.get("/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//show route
router.get("/:id",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id).populate("reviews");
    res.render("./listings/show.ejs",{listing});
}));

//post req from /new to /listings
router.post("/",validateListing,wrapAsync(async (req,res,next)=>{
    // listingSchema=ListingSchema.validate(req.body);
    // if(listingSchema.error) {
    //     throw new ExpressError(listingSchema.error,400);
    // }
    const newListing=new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
}));


//edit route
router.get("/:id/edit",wrapAsync(async (req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
}));


router.put("/:id",validateListing,wrapAsync(async (req,res)=>{
    if(!req.body.listing) throw new ExpressError("Invalid listing data",400);
    let {id}=req.params;
    const listing=await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
}));

//delete route
router.delete("/:id",async (req,res)=>{
    let {id}=req.params;
    let deleteListing=await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
});

module.exports=router;

