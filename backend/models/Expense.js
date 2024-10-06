import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    date: { type: Date, required: true, default: Date.now },
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    amount: { type: Number, required: true },
});

const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;
