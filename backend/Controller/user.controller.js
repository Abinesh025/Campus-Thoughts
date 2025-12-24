import User from "../models/auther.model.js"
import Notification from "../models/notification.model.js"
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary"

export const getUser = async(req,res)=>{
    try{
        
        const {StudentName} = req.params;
        const currentUser = await User.findOne({StudentName});

        return res.json(currentUser);
    }
    catch(err)
    {
        console.log(`Error in userRoutes : ${err}`);
        res.status(500).json({error:"Internal Server in getUser"});
    }
}

export const getFollow = async (req, res) => {
    try {
        const { id } = req.params;  // user to follow

        // User to follow
        const user = await User.findById(id);

        // Current logged-in user
        const currentUser = await User.findById(req.user._id);

        if (!user || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }

        // Prevent following self
        if (id === req.user._id.toString()) {
            return res.status(400).json({ error: "You cannot follow yourself" });
        }

        // Check follow status
        const isFollowing = currentUser.Following.includes(id);

        if (isFollowing) {
            // Unfollow
            await User.findByIdAndUpdate(id, {
                $pull: { Followers: req.user._id }
            });

            await User.findByIdAndUpdate(req.user._id, {
                $pull: { Following: id }
            });

            return res.json({ message: "Unfollowed successfully" });
        } else {
            // Follow
            await User.findByIdAndUpdate(id, {
                $push: { Followers: req.user._id }
            });

            await User.findByIdAndUpdate(req.user._id, {
                $push: { Following: id }
            });

            const notify = new Notification({
                from:req.user._id,
                to:user._idid,
                types:"Follow",
            })

            await notify.save();

            return res.json({ message: "Followed successfully" });
        }

    } catch (err) {
        console.log("Follow Error:", err);
        res.status(500).json({ error: "Internal server error" });
    }
};

export const getSuggestion =async(req,res)=>{
    try{
        const userId = req.user._id;
        const currentUser = await User.findOne(userId);


        const userMatch = await User.aggregate([
            {
                $match:{
                    _id:{$ne:userId}
                }
            },{
                $sample:{
                    size:10
                }
            }
        ])
        const isFollow = userMatch.filter((user)=> !currentUser.Following.includes(user._id));

        const follower = isFollow.slice(0,6);

        follower.forEach((user) => (user.password = null));

        return res.status(200).json(follower)
    }
    catch(err)
    {
        console.log(`Error is ${err}`);
        return res.status(500).json({error:"Internal Server Error in Suggest"});
    }
}

export const getUpdate = async(req,res)=>{
    try{
        const userId = req.user._id;

        let {StudentName,DepartMent,Email,Password,newPassword,RegNum,UserName,Bio,link} = req.body;

        let {ProfileImage,CoverImage}=req.body;


        const user = await User.findById(userId);

        if(!Password && newPassword || !newPassword && Password){
            return res.status(400).json({error:"You Can't Modify"})
        }

        if(Password&&newPassword){
            const passCompare = await bcrypt.compare(Password,user.Password);
            if(!passCompare){
                return res.status(400).json({error:"Current Passweord is in correct"})
            }
            if(newPassword.length < 6 ){
                return res.status(400).json({error:"Password must have 6 characters"})
                     
            }

                    const salt = await bcrypt.genSalt(12);
                    user.Password = await bcrypt.hash(newPassword,salt);
        }

        if(ProfileImage){
            if(user.ProfileImage){
                await cloudinary.uploader.destroy(user.ProfileImage.split("/").pop().split(".")[0])
            }
            const uploadedProfileImage =   await cloudinary.uploader.upload(ProfileImage)
            ProfileImage = uploadedProfileImage.secure_url
        }
        if(CoverImage){
              if(user.CoverImage){
                await cloudinary.uploader.destroy(user.CoverImage.split("/").pop().split(".")[0])
            }
          const uploadedCoverImage =   await cloudinary.uploader.upload(CoverImage)
            CoverImage = uploadedCoverImage.secure_url
        }


        user.StudentName = StudentName || user.StudentName;
        user.DepartMent = DepartMent || user.DepartMent;
        user.Email  = Email|| user.Email;
        user.RegNum = RegNum || user.RegNum;
        user.UserName = UserName || user.UserName
        user.Bio = Bio || user.Bio
        user.link = link || user.link
        user.ProfileImage = ProfileImage || user.ProfileImage
        user.CoverImage = CoverImage || user.CoverImage

        await user.save();


        user.Password = null;
        return res.status(200).json(user);
    }
    catch(error)
    {
        console.log(`Error is ${error.message} abi`);

        return res.status(500).json({error:"Internal Server Error in Update"});
    }
}
