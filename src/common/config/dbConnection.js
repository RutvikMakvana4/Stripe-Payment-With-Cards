import mongoose from "mongoose";

const dbConnection = () => {
    try {
        mongoose.connect(`${process.env.DB_CONNECTION}`);
        console.log("Database connection successfully")
    } catch (error) {
        console.log("Database not connected")
    }
}

export default dbConnection;