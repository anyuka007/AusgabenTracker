import Expense from "../../models/Expense.js";
import Category from "../../models/Category.js";

export const getTotal = async (req, res) => {
    try {
        const { category, year, month } = req.query;
        let match = {};

        // Kategorie-Filter
        if (category) {
            const findCategory = await Category.findOne({ name: category });

            if (!findCategory) {
                return res.status(404).send(`Category ${category} not found`);
            }

            match.category_id = findCategory._id;
            // console.log("matchCategory", match);
        }

        let monthMatch = {};
        let yearMatch = {};

        // Monat filtern
        if (month) {
            const monthNumber = Number(month) - 1; // Monat auf null-basierte Index umrechnen
            const currentYear = new Date().getFullYear();
            const startOfMonth = new Date(year || currentYear, monthNumber, 1);
            const endOfMonth = new Date(
                year || currentYear,
                monthNumber + 1,
                0
            );

            monthMatch = { $gte: startOfMonth, $lte: endOfMonth };
            //console.log("monthMatch", monthMatch);
        }

        // Jahr filtern
        if (year) {
            const startOfYear = new Date(year, 0, 1);
            const endOfYear = new Date(year, 11, 31);

            yearMatch = { $gte: startOfYear, $lte: endOfYear };
            //console.log("yearMatch", yearMatch);
        }

        if (month && year) {
            match.date = {
                $gte: new Date(year, Number(month) - 1, 1),
                $lte: new Date(year, Number(month), 0), // Letzter Tag des Monats
            };
            //console.log("month&&YearMatch", match);
        } else if (month) {
            // Nur Monat
            match.date = monthMatch;
            console.log("monthMatch", match);
        } else if (year) {
            // Nur Jahr
            match.date = yearMatch;
            console.log("yearMatch", match);
        }

        // Aggregation
        const total = await Expense.aggregate([
            { $match: match },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);

        // console.log("matchTotal", match);
        console.log(
            `${"Total".magenta} expenses: ${
                (total[0]?.total || 0).toString().magenta
            }`
        );
        res.json(total);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
