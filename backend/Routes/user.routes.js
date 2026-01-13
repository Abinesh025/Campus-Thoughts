import express from "express";
import { protectMe } from "../utils/protectMe.js";
import { getFollow, getSuggestion, getUpdate, getUser } from "../Controller/user.controller.js";
const userRoutes = express.Router();

userRoutes.route("/name/:StudentName").get(protectMe,getUser);

userRoutes.route("/follow/:id").post(protectMe,getFollow);

userRoutes.route("/suggestion").get(protectMe,getSuggestion);

userRoutes.route("/updateStd").post(protectMe,getUpdate);

export default userRoutes