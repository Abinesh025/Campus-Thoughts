import express from "express";

import { protectMe } from "../utils/protectMe.js";

import { getAll, getComment, getDelete, getFollowingPost, getLikedPosts, getLikes, getPost, getUserPost } from "../Controller/post.controller.js";

const postRoutes = express.Router();

postRoutes.route("/All").get(protectMe,getAll);

postRoutes.route("/create").post(protectMe,getPost);

postRoutes.route("/post/likes/:id").get(protectMe,getLikes);

postRoutes.route("/UserPost/:StudentName").get(protectMe,getUserPost)

postRoutes.route("/post/followerPost").get(protectMe,getFollowingPost);

postRoutes.route("/likedPost/:id").get(protectMe,getLikedPosts);

postRoutes.route("/post/comment/:id").post(protectMe,getComment);

postRoutes.route("/post/delete/:id").delete(protectMe,getDelete);



export default postRoutes