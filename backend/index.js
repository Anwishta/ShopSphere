//packages
import path from "path";
import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import mongoose from "mongoose";
import {useCors } from './middleware/cors.js';
dotenv.config();

import { EventEmitter } from "events";

EventEmitter.defaultMaxListeners = 20; // Increase limit to 20

const app = express();

// const allowedOrigins = ['http://localhost:5173', 'https://shop-sphere-2n6k-ce6rt74a5-anwishtas-projects.vercel.app'];
// const corsOptions = {
//   origin: function (origin, callback) {
//     console.log("Request Origin: ", origin);
//     if (!origin || allowedOrigins.includes(origin)) {
//         return callback(null, true);
//     } else {
//       console.error(`Blocked by CORS: ${origin}`);
//         return callback(new Error('Not allowed by CORS'));
//     }
// },
//   methods: ['GET', 'POST', 'PUT', 'DELETE'],
//   credentials: true, 
// };

app.use(useCors);


// console.log("CORS Origin: ", corsOptions.origin);
// console.log("API URL: ", process.env.VITE_BACKEND_URL);

//Utils

import {connectDB} from "./config/db.js";


import orderRoutes from "./routes/orderRoutes.js";
import returnRoutes from "./routes/returnRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

import cartRoutes from "./routes/cartRoutes.js";



connectDB();

import blogRoutes from "./routes/blogRoutes.js";

const port = process.env.PORT || 5000;

// connectToDatabases();

// add logic to connect to the database


// app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/orders", orderRoutes);
app.use("/api/returns", returnRoutes);
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);

app.use("/api/cart", cartRoutes);


app.use("/api/blogs", blogRoutes);

const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname + "/uploads")));

app.get("/", (req, res) => {
  res.send("API is running!");
});

app.listen(port , () => {
   console.log(`Server is running on port ${port}`);
});
