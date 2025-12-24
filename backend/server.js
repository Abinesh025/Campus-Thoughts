import express from "express";
import dotenv from "dotenv";
import path from "path"
import { fileURLToPath } from "url";
import routes from "./Routes/auther.routes.js";
import  getDataBase  from "./database/server.js";
import cp from "cookie-parser";
import {v2 as cloudinary} from "cloudinary"
import userRoutes from "./Routes/user.routes.js";
import postRoutes from "./Routes/post.routes.js";
import notifyRoutes from "./Routes/notify.routes.js";
import cors from "cors"

const filename = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path:path.join(filename,"Config",".env")});
const app = express();

const __dirname = path.resolve();
app.use(express.json({
    limit:"5mb"
}));

app.use(cors({
    origin : true,
    credentials : true,
    methods:["GET","POST"]
}))


app.use(express.urlencoded({extended:true}))

// dotenv.config()


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET_KEY
})


app.use(cp())


app.use("/api/auther",routes);

app.use("/api/user",userRoutes);

app.use("/api/post",postRoutes);

app.use("/api/notification",notifyRoutes);

    if(process.env.NODE_ENV === "production"){
    app.use(express.static(path.join(__dirname,"/frontend/dist")))
    app.get((req,res)=>{
        res.sendFile(path.resolve(__dirname,"frontend","dist","index.html"))
    })
}


app.listen(process.env.PORT,()=>{
    console.log("The Server is Runs On " + process.env.PORT);
    getDataBase();
})