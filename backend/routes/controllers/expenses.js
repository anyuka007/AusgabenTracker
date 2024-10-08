import mongoose from "mongoose";
import Category from "../../models/Category.js";
import Expense from "../../models/Expense.js";

// GET all expenses

export const getAllExpenses = async (req, res) => {
    try {
        const allExp = await Expense.find({});
        // console.log(`allExp ${allExp}`.cyan);
        res.send(allExp);
    } catch (error) {
        console.error(`Error getting all Expenses: ${error}`.red);
        res.status(500).send({
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
        res.send(expense);
    } catch (error) {
        console.error(`Error: ${error}`.red);
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
            // const { _id } = await Category.findOne({ name: categoryName });
            // if (!_id) {
            return res
                .status(404)
                .send({ error: `Category ${categoryName} not found` });
        }
        const newExpense = await Expense.create({
            ...data,
            category_id: categoryFind._id,
        });
        // console.log(`newExpense: ${newExpense}`.cyan);
        return res.send({
            message: "New expense was added: ",
            expense: newExpense,
        });
    } catch (error) {
        console.error(`Error adding new expense: ${error}`.red);
        res.status(500).send({
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
        // console.log("expense to del", expense);
        if (!expense) {
            console.log("Expense is not found".red);
            return res.status(404).send("Expense is not found");
        }
        await Expense.deleteOne(expense);
        res.send(`Expense ${expense.description} was successfully deleted`);
    } catch (error) {
        console.error(`Error: ${error}`.red);
        res.status(500).send("An error occurred while deleting the expense");
    }
};
