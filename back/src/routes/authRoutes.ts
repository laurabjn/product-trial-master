import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";

const router = express.Router();

// Register a new user
router.post("/register", async (req, res) => {
    const { username, firstname, email, password } = req.body;

    try {
        // Check if the user already exists
        const user = await User.findOne({ $or: [{ username }, { email }] });
        if (user) {
            res.status(400).json({ message: "User already exists" });
        }
        
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const isAdmin = email === "admin@admin.com";

        // Create a new user
        const newUser = new User({
            username,
            firstname,
            email,
            password: hashedPassword,
            isAdmin 
        });

        // Save the user to the database
        await newUser.save();

        res.status(201).json({ message: "Account created successfully" });
    } catch (error) {
        res.status(500).json({ error: "Error creating account" });
    }
});

// Login a user
router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid user" });
        }

        // Check if the password is correct
        const isPasswordCorrect = await bcrypt.compare(password, user!.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid password" });
        }

        // Create a token
        const token = jwt.sign({ userId: user!._id, isAdmin: user!.isAdmin }, process.env.JWT_SECRET as string, { expiresIn: "1h" });

        res.json({ token });
    } catch (error) {
      res.status(500).json({ error: "Error connecting" });
    }
});

export default router;