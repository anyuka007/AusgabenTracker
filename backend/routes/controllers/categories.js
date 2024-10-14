import mongoose from "mongoose";
import Category from "../../models/Category.js";
import Expense from "../../models/Expense.js";

export const getCategories = async (req, res) => {
    try {
        // Extract query parameters from the request
        const limit = Number(req.query.limit) || 0;
        const currentPage = Number(req.query.currentPage) || 1;
        const skip = (currentPage - 1) * limit;
        const sortDirection = req.query.sortDirection === "desc" ? -1 : 1;
        const sortField = req.query.sortBy || "name";

        // Fetch categories from the database with the specified limit, skip, and sort options
        const categories = await Category.find()
            .limit(limit)
            .skip(skip)
            .sort({ [sortField]: sortDirection });

        console.log(
            `There are ${categories.length.toString().brightMagenta} categories`
        );
        res.send(categories);
    } catch (error) {
        console.error("Error fetching categories".red);
        res.status(500).send(error.message);
    }
};

export const getOneCategory = async (req, res) => {
    try {
        const id = req.params.id;

        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid category ID");
        }

        // Fetch the category from the database using the ID
        const category = await Category.findById(id);
        if (!category) {
            console.log("Category not found".red);
            return res.status(404).send("Category not found");
        }

        console.log(
            `Category '${category.name.brightMagenta}' was successfully ${
                "fetched".brightMagenta
            }`
        );
        return res.send(category);
    } catch (error) {
        console.error(`Error getting Category: ${error}`.red);
        return res.status(500).send({
            error: "An error occurred while fetching category",
        });
    }
};

export const addCategory = async (req, res) => {
    try {
        const body = req.body;

        // Check if the body or the name field is missing
        if (!body || !body.name) {
            console.log("Name is required".red);
            return res.status(400).send("Name is required");
        }

        // Create a new category in the database with the provided body
        const newCategory = await Category.create(body);
        console.log(
            `New category '${body.name.brightMagenta}' successfully added`
        );
        return res.send(newCategory);
    } catch (error) {
        console.log(`Error adding new category: ${error}`.red);
        return res.status(500).send(error.message);
    }
};

export const deleteCategory = async (req, res) => {
    try {
        const id = req.params.id;

        // Check if the provided ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).send("Invalid category ID");
        }

        // Fetch the category to delete from the database using the ID
        const categoryToDelete = await Category.findById(id);
        if (!categoryToDelete) {
            console.log("Category not found".red);
            return res.status(404).send("Category not found");
        }

        // Fetch expenses associated with the category ID
        const expencesInCategory = await Expense.find({ category_id: id });

        // If there are no expenses in the category, proceed to delete the category
        if (expencesInCategory.length === 0) {
            await Category.deleteOne(categoryToDelete);
            console.log(
                `Category ${categoryToDelete.name.brightMagenta} successfully ${
                    "deleted".brightMagenta
                }`
            );
            return res.send({ success: true });
        } else {
            // If there are expenses in the category, log the error and send a 409 status
            console.log(
                `The catrgory '${categoryToDelete.name}' cannot be deleted because there are ${expencesInCategory.length} expenses in this category`
                    .red
            );
            return res.status(409).send({ success: false });
        }
    } catch (error) {
        console.log("Error deleting category".red);
        return res
            .status(500)
            .send("An error occurred while deleting the expense");
    }
};

export const editCategory = async (req, res) => {
    const id = req.params.id;
    const body = req.body;
    // Check if the provided ID is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid category ID");
    }
    try {
        // Fetch the category to update from the database using the ID
        const categoryToUpdate = await Category.findById(id);
        //console.log("categoryToUpdate", categoryToUpdate);
        if (!categoryToUpdate) {
            console.log("Category not found".red);
            return res.status(404).send("Category not found");
        }
        // Check if the body or the name field is missing
        if (!body || !body.name) {
            console.log("Name is required".red);
            return res.status(400).send("Name is required");
        }
        //console.log("body", body);

        // Update the category in the database with the provided body
        await Category.updateOne(body);
        // Fetch the updated category from the database
        const updatedCategory = await Category.findById(id);
        //console.log("upd categ", updatedCategory);
        console.log(
            `Category ${categoryToUpdate.name.brightMagenta} successfully ${
                "updated".brightMagenta
            } to ${updatedCategory.name.brightMagenta}`
        );
        return res.send({ success: true });
    } catch (error) {
        console.log(`Error editing category: ${error}`.red);
        return res.send(error.message);
    }
};
