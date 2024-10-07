import express from "express";
import {
    getAllExpenses,
    addExpense,
    deleteExpense,
    getOneExpense,
} from "./controllers/expenses.js";

const expensesRouter = express.Router();

expensesRouter.route("/").get(getAllExpenses).post(addExpense);
expensesRouter.route("/:id").get(getOneExpense).delete(deleteExpense);

export default expensesRouter;
