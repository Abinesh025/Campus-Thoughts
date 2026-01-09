import mongoose from "mongoose";

export const getDataBaseConnection = async()=>{
    mongoose.connect(process.env.MONGODB_URL).then((con)=>{
        console.log("MongoDB is Connected")
    })
    .catch((error)=>{
        console.log(error.message)
    })
}

