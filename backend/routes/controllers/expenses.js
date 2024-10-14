import mongoose from "mongoose";
import Category from "../../models/Category.js";
import Expense from "../../models/Expense.js";

export const getAllExpenses = async (req, res) => {
    try {
        const { category, month, year } = req.query;
        const limit = Number(req.query.limit) || 0;
        const currentPage = Number(req.query.currentPage) || 1;
        const skip = (currentPage - 1) * limit;
        const sortDirection = req.query.sortDirection === "asc" ? 1 : -1;
        const sortField = req.query.sortBy;

        let query = Expense.find()
            .limit(limit)
            .skip(skip)
            .sort({ [sortField]: sortDirection })
            .populate({ path: "category_id", select: "_id name" });

        if (category) {
            const findCategory = await Category.findOne({
                name: category,
            });

            if (category && !findCategory) {
                return res.status(404).send(`Category ${category} not found`);
            }

            const categoryId = findCategory._id;
            query = query.where("category_id").equals([categoryId]);
        }
        let monthCondition = undefined;
        if (month) {
            const monthNumber = Number(month) - 1; // Convert month to zero-based index
            const currentYear = new Date().getFullYear();
            const monthStartDate = new Date(
                year || currentYear,
                monthNumber,
                1
            );
            const monthEndDate = new Date(
                year || currentYear,
                monthNumber + 1,
                1
            );

            monthCondition = {
                date: { $gte: monthStartDate, $lte: monthEndDate },
            };
        }
        let yearCondition = undefined;
        if (year) {
            const yearStartDate = new Date(year, 0, 1);
            const yearEndDate = new Date(year, 11, 31);

            yearCondition = {
                date: { $gte: yearStartDate, $lte: yearEndDate },
            };
        }
        if (month && year) {
            query = query.and([monthCondition, yearCondition]);
        } else if (month || year) {
            query = query.where(monthCondition || yearCondition);
        }
        const allExp = await query.exec();
        let message = `There are ${
            allExp.length.toString().brightMagenta
        } expense(s)`;
        if (category) {
            message += ` in ${category.brightMagenta} the category`;
        }
        if (month) {
            message += ` in ${month.brightMagenta} the month`;
        }
        if (year) {
            message += ` in ${year.brightMagenta} the year`;
        }
        console.log(message);
        res.send(allExp);
    } catch (error) {
        console.error(`Error getting expenses: ${error}`.red);
        return res.status(500).send({
            error: "An error occurred while fetching expenses",
        });
    }
};

export const getOneExpense = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid expense ID");
    }
    try {
        const expense = await Expense.findById(id);
        if (!expense) {
            console.log("Expense not found".red);
            return res.status(404).send("Expense not found");
        }
        console.log(
            `Expense '${expense.description.brightMagenta}' was successfully ${
                "fetched".brightMagenta
            }`
        );
        return res.send(expense);
    } catch (error) {
        console.error(`Error: ${error}`.red);
        return res.status(500).send(error);
    }
};

export const addExpense = async (req, res) => {
    try {
        const data = req.body;
        if (!data.category || !data.description || !data.amount) {
            return res.status(400).send({
                error: "Description, category and amount are required fields",
            });
        }
        if (isNaN(data.amount)) {
            return res.status(400).send({
                error: "The amount must be a number",
            });
        }
        const categoryName = data.category;
        const categoryFind = await Category.findOne({ name: categoryName });
        if (!categoryFind) {
            return res
                .status(404)
                .send({ error: `Category '${categoryName}' not found` });
        }
        const newExpense = await Expense.create({
            ...data,
            category_id: categoryFind._id,
        });
        console.log(
            `New expense '${
                newExpense.description.brightMagenta
            }' was  successfully ${"added".brightMagenta}`
        );
        return res.status(201).send(newExpense);
    } catch (error) {
        console.error(`Error adding new expense: ${error}`.red);
        return res.status(500).send({
            error: "An error occurred while adding the expense",
        });
    }
};

export const deleteExpense = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid expense ID");
    }
    try {
        const expense = await Expense.findById(id);
        if (!expense) {
            console.log("Expense not found".red);
            return res.status(404).send("Expense not found");
        }
        await Expense.deleteOne(expense);
        console.log(
            `Expense '${expense.description.brightMagenta}' was successfully ${
                "deleted".brightMagenta
            }`
        );
        res.send({ success: true });
    } catch (error) {
        console.error(`Error: ${error}`.red);
        return res
            .status(500)
            .send("An error occurred while deleting the expense");
    }
};

export const editExpense = async (req, res) => {
    const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid expense ID");
    }
    try {
        const data = req.body;
        // console.log("dataUpdate", data);
        if (!data || Object.keys(data).length === 0) {
            return res
                .status(400)
                .send("Please provide data to update the expense");
        }
        const expenseToUpdate = await Expense.findById(id);
        if (!expenseToUpdate) {
            console.log("Expense not found".red);
            return res.status(404).send("Expense not found");
        }
        await Expense.updateOne({ _id: id }, data);
        const updatedExpense = await Expense.findById(id);
        console.log(
            `The expense ${
                expenseToUpdate.description.brightMagenta
            } was successfully ${"updated".brightMagenta}`
        );
        return res.send(updatedExpense);
    } catch (error) {
        console.log("Error updating an expense: ", error);
        return res.status(500).send(error);
    }
};
