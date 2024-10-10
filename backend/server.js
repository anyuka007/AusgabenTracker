import express from "express";
import connect from "./lib/db.js";
import expensesRouter from "./routes/expencesRouter.js";
import totalRouter from "./routes/totalRouter.js";
import colors from "colors";
import morgan from "morgan";

await connect();
const app = express();
app.use(express.json());

app.use(morgan("dev"));

app.use("/expenses/total", totalRouter);
app.use("/expenses", expensesRouter);

const port = 3001;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`.yellow.bold);
});
