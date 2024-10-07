import mongoose from "mongoose";

const ExpenseSchema = new mongoose.Schema({
    date: { type: Date, required: true, default: Date.now },
    description: { type: String, required: true },
    category_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    amount: { type: Number, required: true },
});

const Expense = mongoose.model("Expense", ExpenseSchema);
export default Expense;
