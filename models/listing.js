const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");

const listingSchema=new Schema({
    title:{type:String,required:true},
    description:{type:String},
    image:{type:String,
        default:"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/5a/c3/d8/photo0jpg.jpg?w=1200&h=-1&s=1",
        set:(v)=> v===""?"https://dynamic-media-cdn.tripadvisor.com/media/photo-o/11/5a/c3/d8/photo0jpg.jpg?w=1200&h=-1&s=1":v,
    },
    price:{type:Number,
        default:10000,
    },
    location:{type:String},
    country:{type:String},
    reviews:[
        {
            type:Schema.Types.ObjectId,
            ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
})

listingSchema.post("findOneAndDelete",async (listing)=>{
    if(listing){
    await Review.deleteMany({_id:{$in:listing.reviews}});
    }
})

const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;