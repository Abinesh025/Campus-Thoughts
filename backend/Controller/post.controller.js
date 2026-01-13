import User from "../models/auther.model.js";
import Post from "../models/post.model.js";
import Notification from "../models/notification.model.js"
import {v2 as cloudinary} from "cloudinary";

export const getPost = async(req,res)=>{
    try{
        const {text} = req.body;
        let {img}=req.body

        const userId = req.user._id.toString();

        const postUser = await User.findById(userId);

        if(!postUser){
            return res.status(400).json({error:"Current User Not Found"});
        }

        if(!img && !text){
            return res.status(400).json({error:"You Can't Post Anything"})
        }

        if(img){
            try{
                const uploadResponse = await cloudinary.uploader.upload(img);
                img = uploadResponse.secure_url;
            }catch(error)
            {
                console.log(`UPLOAD FAILED ${error}`)
            }
        }

        const newPost = new Post({
            text,
            img,
            user:userId
        })

        await newPost.save();

        return res.status(200).json(newPost);

    }catch(error)
    {
        console.log(`Error in ${error}`);
        return res.status(500).json({error:"Internal Server Error in post"});
    }
}

export const getDelete = async(req,res)=>{
    try{
        const {id} = req.params;
        const post = await Post.findById({_id:id});

        if(!post){
            return res.status(400).json({error:"Post Not Found"})
        }

        if(post.user.toString() !== req.user._id.toString()){
            return res.status(401).json({error:"You Can't Have Access to Delete Post"});
        }

        if(post.img){
            const deletePost =  post.img.split("/").pop().split(".")[0];
           await cloudinary.uploader.destroy(deletePost)
        }

        await Post.findByIdAndDelete(id);

        return res.status(200).json({message:"Deleted SuccessFully"});
    }
    catch(err)
    {
        console.log(`Error in ${err}`);
        return res.status(500).json({error:"Internal server error Delete"});
    }
}

export const getComment = async(req,res)=>{
    try{
        const postId = req.params.id;
        const {text} = req.body;
        const userId = req.user._id;

        if(!text){
            return res.status(400).json({error:"Text not Found"});
        }

        const post = await Post.findById(postId);

        if(!post){
            return res.status(400).json({error:"Post Not Found"});
        }

        const comment = {
            text,
            user:userId
        }


        post.comments.push(comment);

        await post.save();

        const notify = new Notification({
                from:userId,
                to:post.user,
                types:"Commented",
            })

        await notify.save()

        return res.status(200).json(comment);

    }
    catch(err)
    {
        console.log(`Error in ${err}`);
        return res.status(500).json({error:"internal Server in Error in Comments"})
    }
}

export const getLikes = async(req,res)=>{
    try{
        const {id:postId} = req.params;
        const userId = req.user._id;

        const users = await Post.findById(postId);



        if(!users){
            return res.status(400).json({error:"User Not Found"});
        }

        const likedPost = users.likes.includes(userId);

        if(likedPost){
            //unlike
            await Post.findByIdAndUpdate({_id:postId},{$pull:{likes :userId}});
            await User.findByIdAndUpdate({_id:userId},{$pull:{likedPosts:postId}});

            const updateLikePost = users.likes.filter((id)=>id.toString() !== userId.toString());
            return  res.status(200).json(updateLikePost);
        }
        else{
            //like
            users.likes.push(userId);

            await User.findByIdAndUpdate({_id:userId},{$push:{likedPosts:postId}});

            await users.save();

            const updateLikePost = users.likes

            return res.status(200).json(updateLikePost);
        }

            const notify = new Notification({
                from:userId,
                to:users.user,
                types:"like",
            })

            await notify.save();
        }
    catch(err)
    {
        console.log(`Error in ${err}`);
        return res.status(500).json({error:"Internal Server Error in likes"})
    }
}

export const getAll = async(req,res)=>{
    try{
        const posts = await Post.find().sort({createdAt:-1}).populate({
            path:"user",
            select:("-Password")
        }).populate({
            path:"comments.user",
            select:("-Password")
        })

        if(!posts.length === 0){
            return res.status(200).json([])
        }

        return res.status(200).json(posts);
    }catch(err)
    {
        console.log(`Error is ${err}`);
        return res.status(500).json({error:"Internal Server Error in All Post"});
    }
}

export const getLikedPosts  = async(req,res)=>{
    try{

        const userid = req.params.id;

        const user = await User.findById(userid)

        if(!user){
            return res.status(400).json({error:"User Not Found"});
        }

        const likedPosts = await Post.find({_id:{$in:user.likedPosts}}).sort({createdAt:-1}).populate({
            path:"user",
            select:("-Password")
        });
        
        res.json(likedPosts);
    }
    catch(err)
    {
        console.log(`Error in LikedPosts ${err}`);
        return res.status(500).json({error:"Internal Server Error in LikedPosts"})
    }
}

export const getFollowingPost = async(req,res)=>{
    try{
        const userId = req.user._id;

        const userPost = await User.findOne(userId);

        if(!userPost){
            return res.status(400).json({error:"User Not Found"});
        }

        const buddies = userPost.Buddies

        const followerPost = await Post.find({user:{$in:buddies}}).sort({createdAt:-1}).populate({
            path:"user",
            select:("-Password")
        })

        return  res.status(200).json(followerPost);
    }
    catch(err)
    {
        console.log(`Error in ${err}`);
        return res.status(500).json({error:"Error in followersPost"})
    }
}

export const getUserPost = async(req,res)=>{
    try{
        const {StudentName}=req.params;
        const user =await User.findOne({StudentName:StudentName})

        if(!user){
            return res.status(400).json({error:"User Not Found"});
        }

        const userPost = await Post.find({user:user._id}).sort({createdAt:-1}).populate({
            path:"user",
            select:("-Password")
        });

        if(!userPost){
            return res.status(400).json({error:"User post is Not Found"});
        }

        return res.status(200).json(userPost)
    }
    catch(err)
    {
        console.log(`Error in ${err}`);
        return res.status(500).json({error:"Internal Server in UserPost"});
    }
}