import express from "express";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";
import Wishlist from "../models/Wishlist";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Wishlist
 *   description: Wishlist management
 */

/**
 * @swagger
 * /wishlist:
 *   post:
 *     summary: Add a product to the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: ID of the product to add
 *     responses:
 *       200:
 *         description: Product added to wishlist
 *       404:
 *         description: Wishlist not found
 */
router.post("/wishlist", authMiddleware, async (req: AuthRequest, res) => {
  const { productId } = req.body;
  const userId = req.user!.userId;

  let wishlist = await Wishlist.findOne({ userId });

  if (!wishlist) {
    wishlist = new Wishlist({ userId, products: [] });
  }

  if (!wishlist.products.includes(productId)) {
    wishlist.products.push(productId);
  }

  await wishlist.save();
  res.json(wishlist);
});

/**
 * @swagger
 * /wishlist/{productId}:
 *   delete:
 *     summary: Remove a product from the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to remove
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from wishlist
 *       404:
 *         description: Wishlist not found
 */
// router.delete("/wishlist/:productId", authMiddleware, async (req: AuthRequest, res) => {
//   const { productId } = req.params;
//   const userId = req.user!.userId;

//   const wishlist = await Wishlist.findOne({ userId });

//   if (!wishlist) return res.status(404).json({ error: "Wishlist not found" });

//   wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
//   await wishlist.save();

//   res.json(wishlist);
// });

/**
 * @swagger
 * /wishlist:
 *   get:
 *     summary: Retrieve the wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *       404:
 *         description: Wishlist not found
 */
router.get("/wishlist", authMiddleware, async (req: AuthRequest, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user!.userId }).populate("products");
  res.json(wishlist);
});

export default router;