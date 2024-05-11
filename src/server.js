import dotenv from 'dotenv';
import { connectDB } from './db/connectDB.js';
import { app } from './app.js';
import colors from 'colors';

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`server is running at port:${process.env.PORT}`.bgMagenta);
    })
})
.catch((err)=>{
    console.log(`mongodb connection failed`.bgRed);
})