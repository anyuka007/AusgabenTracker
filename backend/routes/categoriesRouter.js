import express from "express";
import {
    addCategory,
    deleteCategory,
    getCategories,
    getOneCategory,
} from "./controllers/categories.js";

const categoriesRouter = express.Router();

categoriesRouter.route("/").get(getCategories).post(addCategory);
categoriesRouter.route("/:id").get(getOneCategory).delete(deleteCategory);

export default categoriesRouter;
