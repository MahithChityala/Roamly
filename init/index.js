const mongoose=require("mongoose");
const initData=require("./data.js");
const Listing=require("../models/listing");

const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
async function main(){
    await mongoose.connect(MONGO_URL);
}

main().then(()=>{
    console.log("connected to Database");
}).catch((err)=>{
    console.log(err);
});

const initDB=async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"68125a1d927ba4af2e2e17da",}));
    await Listing.insertMany(initData.data);
        console.log("Data inserted");
}

initDB();