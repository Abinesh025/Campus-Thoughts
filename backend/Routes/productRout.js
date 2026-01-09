import express from "express";
import { getProducts } from "../Controller/productsControl.js";
const productsRouter = express.Router();


productsRouter.route("/products").get(getProducts);

export default productsRouter