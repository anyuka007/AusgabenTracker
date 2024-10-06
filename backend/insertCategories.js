import Category from "./models/Category.js";
import connect from "./lib/db.js";

const categories = [
    "Auto & Transport",
    "Bildung",
    "Cafes & Restaurants",
    "Gesundheit",
    "Haushalt & Wohnen",
    "Lebensmittel",
    "Mode",
    "Reisen",
    "Sport",
    "Unterhaltung & Freizeit",
    "Wohnungs- & Mietkosten",
    "Sonstige Ausgaben",
];

export default async function insertCategories(categories) {
    try {
        const categoriesObj = categories.map((category) => ({
            name: category,
        }));
        console.log("categoriesObj", categoriesObj);
        await connect();
        await Category.insertMany(categoriesObj);
        console.log("categories are added into DB", categories);
    } catch (error) {
        console.error("Error adding categories into DB", error);
    }
}

await insertCategories(categories);
