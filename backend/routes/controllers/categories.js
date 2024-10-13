import Category from "../../models/Category.js";

export const getCategories = async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 0;
        const currentPage = Number(req.query.currentPage) || 1;
        const skip = (currentPage - 1) * limit;
        const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;
        const sortField = req.query.sortBy;

        const categories = await Category.find()
            .limit(limit)
            .skip(skip)
            .sort({ [sortField]: sortDirection });

        console.log(
            `There are ${categories.length.toString().magenta} categories`
        );
        res.send(categories);
    } catch (error) {
        console.error("Error fetching categories".red);
        res.send(error);
    }
};
