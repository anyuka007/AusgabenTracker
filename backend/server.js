import express from "express";
import connect from "./lib/db.js";

await connect();
const app = express();
app.use(express.json());

const port = 3001;
app.listen(port, () => {
    console.log("Server is running on port ", port);
});
