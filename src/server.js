import dotenv from 'dotenv';
import { connectDB } from './db/connectDB.js';
import { app } from './app.js';
import colors from 'colors';

dotenv.config({
    path:'./.env'
})

// Import routes
import userRoutes from './routes/user.route.js'

// Mount userRoutes onto /user endpoint
app.use('/user', userRoutes);

connectDB()
    .then(() => {
        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port: ${process.env.PORT}`.bgMagenta);
        });
    })
    .catch((err) => {
        console.log(`MongoDB connection failed`.bgRed);
    });
