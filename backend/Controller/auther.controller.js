import user from "../models/auther.model.js";
import bcrypt from "bcryptjs";
import { getToken } from "../utils/tokens.js";
import autherModel from "../models/auther.model.js";

export const getSignUp =async(req,res)=>{
    try{
        const {StudentName,DepartMent,RegNum,Email,Password,UserName} = req.body;

        const existingEamil = await user.findOne({Email});

        const existingStd = await user.findOne({StudentName});

        if(existingEamil && existingStd ){
            return res.status(400).json({error:"User or Email is Already exists"})
        }
        
        const regexofReg =  /^8208E(2[3-9]|[3-9][0-9])(CSR|ITR|MER|ADR|BSR|BER|EER|ECR'|CER)[0-9]{3}$/;
        const regNum = regexofReg.test(RegNum);

        if(!regNum){
            return res.status(400).json({error : "Please enter Valid ReGnum Format "})
        }

        // EMAIL
        const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const emailCheck = emailReg.test(Email);
        if(!emailCheck){
            return res.status(400).json({error : "Please enter Valid Email Format "})
        }

        if(Password.length < 6 ){
            res.status(400).json({error:"Password must have 6 Characters"})
        }

        const roundPassword = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(Password,roundPassword);



    const users = new  user({
            StudentName,
            UserName,
            Password:hashPassword,
            Email,
            DepartMent,
            RegNum
        })

       await users.save();
       return  res.status(200).json(users);
    }catch(error){
            console.log(`The error is ${error.message}`);
            return res.status(500).json({error:"Internal Server Error"});
    }
};

export const getLogin = async(req,res)=>{
    try{
        const {StudentName,Password} = req.body;

        const newUser = await user.findOne({StudentName});

        if(!newUser){
            return res.status(400).json({error:"User Not Find"});
        }
        const passwordVerify = await bcrypt.compare(Password,newUser?.Password || ""); 

        if(!passwordVerify){
            return res.status(400).json({error:"Password doesn't Match"});
        }

        if(newUser){
            getToken(newUser._id,res);
            res.status(200).json({
                StudentName:newUser.StudentName,
                UserName:newUser.UserName,
                DepartMent:newUser.DepartMent,
                Email:newUser.Email,
                RegNum:newUser.RegNum
            })
        }

    }catch(err)
    {
            return res.status(200).json({error:`Error is  ${err}`});
    }
}

export const getLogout  = async(req,res)=>{
    try{
        res.cookie("jwt","",{maxAge:0});
        return res.status(200).json({message:"Logout SuccessFully"});
    }
    catch(error)
    {
        console.log(`Error in ${error}`);
        return res.status(400).json({error:"Internal Server Error"});
    }
}

export const getMe = async(req,res)=>{
    try{
        const user = await autherModel.findOne({_id:req.user._id});

        return res.status(200).json(user);
    }
    catch(error)
    {
        console.log(`Error in ${error}`);
        return res.status(400).json({error:"Server Error in getme"});
    }
}