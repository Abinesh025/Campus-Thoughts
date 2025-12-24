import mongoose from "mongoose";
import { hostname } from "os";

const getDataBase = async()=>{
        try{
            await mongoose.connect(process.env.MONGODB_URL ).then(()=>{
                console.log(`The MongoDb is runs on` + process.env.PORT)
            })
        }
        catch(error)
        {
            console.log(error.message)
        }
}

export default getDataBase