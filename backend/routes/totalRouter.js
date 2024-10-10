import express from "express";
import { getTotal } from "./controllers/total.js";

const totalRouter = express.Router();

totalRouter.route("/").get(getTotal);

export default totalRouter;
