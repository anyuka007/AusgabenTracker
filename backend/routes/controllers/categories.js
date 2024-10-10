import Category from "../../models/Category.js";

export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find();
        console.log(
            `There are ${categories.length.toString().magenta} categories`
        );
        res.send(categories);
    } catch (error) {
        console.error("Error fetching categories".red);
        res.send(error);
    }
};
