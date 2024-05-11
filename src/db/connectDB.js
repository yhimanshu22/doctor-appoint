import mongoose from "mongoose";
import colors from 'colors';
import { DB_NAME } from "../constants.js";

const connectDB = async ()=>{
    try {
        if(!process.env.MONGODB_URL){
            throw new Error('MONGODB_URL is not set')
        }
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URL}${DB_NAME}`)
        console.log(`mongodb connected !! DB HOST:${connectionInstance}`.bgCyan)
    }catch (error) {
        console.log(`error connecting to database ${error}`.bgRed);
        process.exit(1);
    }
}

export {connectDB};