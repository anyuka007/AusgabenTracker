import express from "express";
import {
    getAllExpenses,
    addExpense,
    deleteExpense,
    getOneExpense,
    editExpense,
} from "./controllers/expenses.js";

const expensesRouter = express.Router();

expensesRouter.route("/").get(getAllExpenses).post(addExpense);
expensesRouter
    .route("/:id")
    .get(getOneExpense)
    .delete(deleteExpense)
    .put(editExpense);

export default expensesRouter;
