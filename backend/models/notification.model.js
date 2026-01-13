import mongoose  from "mongoose";


const notificationSchema  = new mongoose.Schema({
        from:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            Enumerator:["follow,link"]
        },
        to:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            Enumerator:["follow,link"]
        },

        types:{
            type:String,
            required:true
        },

        read:{
            type:Boolean,
            default:false
        }
    },
    {timestamps:true}
);

const notificationModel =new  mongoose.model("Notification",notificationSchema);

export default notificationModel;