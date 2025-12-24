import mongoose from "mongoose";
import { hostname } from "os";

const getDataBase = async(req,res)=>{
        try{
            await mongoose.connect(process.env.MONGODB_URL ).then((con)=>{
                console.log(`The MongoDb is runs on` + process.env.PORT)
            })
        }
        catch(error)
        {
            console.log(error.message)
        }
}

export default getDataBase