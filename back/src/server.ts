import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import session from "express-session";

import { setupSwagger } from "./swagger";
import authRoutes from "./routes/authRoutes";

dotenv.config();
console.log(process.env.MONGO_URI);

const app = express();
app.use(express.json());
app.use(cors());

app.use(
    session({
      secret: process.env.SESSION_SECRET || "default_secret",
      resave: false,
      saveUninitialized: true,
      cookie: { secure: false },
    })
);

setupSwagger(app);

// Check that MONGO_URI is loaded
if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in .env file");
}

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI as string)
    .then(() => {
        console.log("Connected to MongoDB");
    })
    .catch((err) => {
        console.error("MongoDB connection error:", err);
    });

// Routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});