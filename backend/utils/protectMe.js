import jsonwebtoken from "jsonwebtoken";
import userModel from "../models/auther.model.js";

export const protectMe = async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;

        if(!token){
            return res.status(400).json({error:"Token is not Found"})
        }
        
        const decoded = jsonwebtoken.verify(token,process.env.KEY);

        if(!decoded){
            return res.status(400).json({error:"Token Doesn't Match"});
        }

        const user = await userModel.findOne({_id: decoded.userID}).select("-password");

        if(!user){
            return res.status(400).json({error:"User Not Found"});
        }

        req.user = user;
        next()
    }
    catch(err)
    {
        console.log(`Error in  ${err}`);
        return res.status(500).json({error:"Internal Server Error in protect,e"})
    }
}