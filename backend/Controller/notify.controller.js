import path from "path";
import Notification from "../models/notification.model.js";

//Get Notifications

export const getNotification = async(req,res)=>{
    try{
        const userId = req.user._id;

        const notification = await Notification.find({to:userId}).sort({createdAt:-1}).populate({
            path:"from",
            select:("StudentName ProfileImage")
        }).populate({
            path:"to",
            select:("StudentName ProfileImage")
        });

        await Notification.updateMany({to:userId},{read:true})

        res.status(200).json(notification)
    }
    catch(err)
    {
        console.log(`Error in ${err}`);
        return res.status(500).json({error:"Internal Server Error in Notification Model"});
    }
}

//Delete Notifications

export const getDeleteNotification = async(req,res)=>{
    try
    {
        const userId = req.user._id;

        await Notification.deleteMany({to:userId});

        return res.status(200).json({message:"Notification Deleted Successfuly"});
    }
    catch(err)
    {
        console.log(`Error in ${err}`);

        return res.status(500).json({error:"Error in Deleted Notification"});
    }
}