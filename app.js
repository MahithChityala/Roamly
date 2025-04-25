const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");



const listings=require("./router/listing.js");
const reviews=require("./router/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const port=7000;

async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected to Database");
}).catch((err)=>{
    console.log(err);
});

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
});

app.get("/",(req,res)=>{
    res.send("root");
})

// app.get("/testListing",async (req,res)=>{
//     const sampleListing=new Listing({
//         title:"villa",
//         description:"nice villa",
//         price:1000,
//         location:"goa",
//         country:"India"
//     })
//     await sampleListing.save().then((res)=>{
//         console.log("sample was saved");
//     })
//     res.send("successful testing");
// })



app.use("/listings",listings);

app.use("/listings/:id/reviews",reviews);





//404 route
// app.all("*",(req,res,next)=>{
//     next(new ExpressError("Page not found",404));
// })

//custom error
app.use((err,req,res,next)=>{
    let {message="something went wrong!",statusCode=500}=err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("listings/error.ejs",{message});
})




