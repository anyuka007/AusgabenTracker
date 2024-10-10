import express from "express";
import { getCategories } from "./controllers/categories.js";

const categoriesRouter = express.Router();

categoriesRouter.route("/").get(getCategories);

export default categoriesRouter;
