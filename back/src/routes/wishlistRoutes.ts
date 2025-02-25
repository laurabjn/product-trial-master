import express, { Response } from "express";
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
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
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
 * /wishlist/clear:
 *   delete:
 *     summary: Clear the entire wishlist
 *     tags: [Wishlist]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist cleared successfully
 *       404:
 *         description: Wishlist not found
 */
router.delete("/clear", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      res.status(404).json({ error: "Wishlist not found" });
      return;
    }

    // Vider la liste des produits
    wishlist.products = [];
    await wishlist.save();

    res.json({ message: "Wishlist cleared", wishlist });
  } catch (error) {
    console.error("Error clearing wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
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
router.delete("/:productId", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const userId = req.user!.userId;

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      res.status(404).json({ error: "Wishlist not found" });
      return;
    }

    wishlist.products = wishlist.products.filter((p) => p.toString() !== productId);
    await wishlist.save();

    res.json(wishlist);
  } catch (error) {
    console.error("Error removing product from wishlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


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
router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const wishlist = await Wishlist.findOne({ userId: req.user!.userId }).populate("products");
  res.json(wishlist);
});

export default router;