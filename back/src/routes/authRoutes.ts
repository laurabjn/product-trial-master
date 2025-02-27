import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/User";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Error creating account
 */
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

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in successfully, returns a JWT token
 *       400:
 *         description: Invalid user or password
 *       500:
 *         description: Error connecting
 */
router.post("/login", async (req: express.Request, res: express.Response): Promise<void> => { // Correction du typage
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ message: "Invalid user" });
            return;
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            res.status(400).json({ message: "Invalid password" });
            return;
        }

        const token = jwt.sign(
            { userId: user._id, isAdmin: user.isAdmin }, 
            process.env.JWT_SECRET as string, 
            { expiresIn: "1h" }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: "Error connecting" });
    }
});

export default router;