import mongoose from "mongoose";
import { hostname } from "os";

const getDataBase = async()=>{
        try{
            await mongoose.connect(process.env.MONGODB_URL )
                console.log("The MongoDb connected")
            
        }
        catch(error)
        {
            console.log(`The error in mongoDB Database ${error}`)
            process.exit(1);
        }
}

export default getDataBase