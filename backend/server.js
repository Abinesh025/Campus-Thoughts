import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { getDataBaseConnection } from "./DataBase/db.js";
import productsRouter from "./Routes/productRout.js";

const app = express();


const filename = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({path:path.join(filename,"config",".env")});



app.use("/api/get",productsRouter);



// <-------------Running Port------------>

app.listen(process.env.PORT,()=>{
    console.log(`The server is runs on ${process.env.PORT} for ${process.env.NODE_ENV}`);
    getDataBaseConnection();
})