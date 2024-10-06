import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

async function connect() {
    const uri = process.env.MONGODB_URI;
    try {
        await mongoose.connect(uri);
        console.log(
            `Connected to MongoDB with Mongoose to database ${mongoose.connection.name}`
        );
    } catch (error) {
        console.error("Error connecting to database", error);
    }
}

export default connect;
