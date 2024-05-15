import mongoose from "mongoose";
import colors from 'colors';
import { DB_NAME } from "../constants.js";
const connectDB = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error('MONGODB_URL is not set');
        }
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URL, {
            dbName: DB_NAME, // Assuming DB_NAME is defined elsewhere
        });
        console.log(`MongoDB connected !! DB HOST: ${connectionInstance.connections[0].host}`.bgCyan);
    } catch (error) {
        console.error(`Error connecting to database: ${error.message}`.bgRed);
        process.exit(1);
    }
};

export { connectDB };
