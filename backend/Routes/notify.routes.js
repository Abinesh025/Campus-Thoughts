import express from "express";
import { protectMe } from "../utils/protectMe.js";
import { getDeleteNotification, getNotification } from "../Controller/notify.controller.js";

const notifyRoutes = express.Router();


notifyRoutes.route("/").get(protectMe,getNotification);

notifyRoutes.route("/delete").delete(protectMe,getDeleteNotification);


export default notifyRoutes