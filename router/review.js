const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const Listing=require("../models/listing.js");
const Review=require("../models/review.js");
const {isLoggedIn,validateReview,isReviewAuthor}=require("../middleware.js");


//reviews
//post review route
router.post("/",
    isLoggedIn,
    validateReview,
    wrapAsync(async (req,res)=>{
    const {id}=req.params;
    const listing=await Listing.findById(id);
    const newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success","Successfully added a new review!");
    console.log("new review added to listing",listing.reviews);
    res.redirect(`/listings/${id}`);
}));

//delete review route
router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Successfully deleted the review!");
    res.redirect(`/listings/${id}`);
}
));

module.exports = router;