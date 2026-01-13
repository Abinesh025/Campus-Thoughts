import express from "express";
import { getLogin, getLogout, getMe, getSignUp } from "../Controller/auther.controller.js";
const routes = express.Router();
import { protectMe } from "../utils/protectMe.js";

routes.route("/signup").post(getSignUp)

routes.route("/login").post(getLogin);

routes.route("/logout").post(getLogout);

routes.route("/me").get(protectMe,getMe)

export default routes