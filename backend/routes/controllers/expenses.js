import mongoose from "mongoose";
import Category from "../../models/Category.js";
import Expense from "../../models/Expense.js";

export const getAllExpenses = async (req, res) => {
    try {
        const { categoryFilter, month, year } = req.query;
        let query = Expense.find();
        if (categoryFilter) {
            const findCategory = await Category.findOne({
                name: categoryFilter,
            });
            if (categoryFilter && !findCategory) {
                return res
                    .status(404)
                    .send(`Category ${categoryFilter} not found`);
            }
            const categoryId = findCategory._id;

            const allExp = await query
                .find({})
                .where("category_id")
                .equals([categoryId]);
            console.log(
                `There are ${
                    allExp.length.toString().brightMagenta
                } expense(s) in category ${categoryFilter.brightMagenta}`
            );
            res.send(allExp);
        } else if (month) {
            console.log("month", month);
            const monthNumber = Number(month) - 1; // Convert month to zero-based index
            const currentYear = new Date().getFullYear();
            const startDate = new Date(currentYear, monthNumber, 1);
            const endDate = new Date(currentYear, monthNumber + 1, 1);

            const allExp = await query
                .find({})
                .where("date")
                .gte(startDate)
                .lte(endDate);
            console.log(
                `There are ${
                    allExp.length.toString().brightMagenta
                } expenses in ${month.brightMagenta} month`
            );
            res.send(allExp);
        } else if (year) {
            console.log("year", year);

            const startDate = new Date(year, 0, 1);
            const endDate = new Date(year, 11, 31);

            const allExp = await query
                .find({})
                .where("date")
                .gte(startDate)
                .lte(endDate);

            console.log(
                `There are ${
                    allExp.length.toString().brightMagenta
                } expenses in ${year.brightMagenta} year`
            );
            res.send(allExp);
        } else {
            const allExp = await query.find({});
            console.log(
                `There are ${allExp.length.toString().brightMagenta} expense(s)`
            );
            res.send(allExp);
        }
    } catch (error) {
        console.error(`Error getting all Expenses: ${error}`.red);
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
            console.log("Expense is not found".red);
            return res.status(404).send("Expense is not found");
        }
        console.log(
            `Expense '${expense.description.brightMagenta}' was successfully ${
                "fetched".brightMagenta
            }`
        );
        const date = new Date(expense.date);
        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        console.log("year", year);
        console.log("month", month + 1);
        console.log("day", day);
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
                error: "Amount must be a number",
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
            error: "An error occurred while adding expense",
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
            console.log("Expense is not found".red);
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
            console.log("Expense is not found".red);
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
