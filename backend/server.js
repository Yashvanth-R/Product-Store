import express from 'express';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

import productRoutes from './routes/product.route.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT

app.use(express.json()); // Middleware to parse JSON data request bodies

app.use("/api/products", productRoutes);

app.listen(PORT, () => {
    connectDB();
    console.log("Server is running at http://localhost:"+ PORT);
});
