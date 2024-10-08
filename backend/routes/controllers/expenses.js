import mongoose from "mongoose";
import Category from "../../models/Category.js";
import Expense from "../../models/Expense.js";

export const getAllExpenses = async (req, res) => {
    try {
        const allExp = await Expense.find({});
        // console.log(`allExp ${allExp}`.cyan);
        res.send({
            success: true,
            count: `There are ${allExp.length} expenses`,
            allExpences: allExp,
        });
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
        console.log("expense getOne", expense);
        if (!expense) {
            console.log("Expense is not found".red);
            return res.status(404).send("Expense is not found");
        }
        res.send({
            message: `Expense '${expense.description}' was successfully fetched`,
            result: expense,
        });
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
        // console.log(`newExpense: ${newExpense}`.cyan);
        return res.status(201).send({
            message: "New expense was  successfully added: ",
            expense: newExpense,
        });
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
        res.send(`Expense '${expense.description}' was successfully deleted`);
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
        return res.send({
            message: "The expense was successfully updated",
            expense: updatedExpense,
        });
    } catch (error) {
        console.log("Error updating an expense: ", error);
        return res.status(500).send(error);
    }
};
