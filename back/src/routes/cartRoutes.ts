import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import { Request, Response } from "express";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: Cart management using sessions
 */

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add a product to the cart (stored in session)
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - quantity
 *             properties:
 *               productId:
 *                 type: string
 *                 example: "65e7a4f1289b2c001f33bc55"
 *               quantity:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Product added to cart successfully
 *       500:
 *         description: Internal server error
 */
router.post("/", authMiddleware, (req: Request, res: Response) => {
  try {
    console.log("Before adding :", req.session.cart);
    const { productId, quantity } = req.body;

    if (!req.session.cart) {
      req.session.cart = [];
    }

    const existingProduct = req.session.cart.find((product) => product.productId === productId);

    if (existingProduct) {
      existingProduct.quantity += quantity;
    } else {
      req.session.cart.push({ productId, quantity });
    }

    console.log("After adding :", req.session.cart);
    res.json({ message: "Product added to cart", cart: req.session.cart });
  } catch (error) {
    console.error("Error adding product to cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the cart from session
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: The user's cart
 *       500:
 *         description: Internal server error
 */
router.get("/", authMiddleware, (req: Request, res: Response) => {
  try {
    res.json({ cart: req.session.cart || [] });
  } catch (error) {
    console.error("Error fetching cart:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
});

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear the cart in session
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       500:
 *         description: Internal server error
 */
router.delete("/clear", authMiddleware, (req: Request, res: Response) => {
  try {
    console.log("Clearing cart...");
    req.session.cart = [];
    res.json({ message: "Cart cleared", cart: [] });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Remove a product from the cart in session
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         schema:
 *           type: string
 *         required: true
 *         description: The product ID to remove from the cart
 *     responses:
 *       200:
 *         description: Product removed from cart successfully
 *       404:
 *         description: Product not found in cart
 *       500:
 *         description: Internal server error
 */
router.delete("/:productId", authMiddleware, (req: Request, res: Response): void => {
  if (!req.session.cart) {
    res.status(404).json({ error: "Cart is empty" });
    return;
  }

  const { productId } = req.params;

  const initialCartLength = req.session.cart.length;
  req.session.cart = req.session.cart.filter((p) => p.productId !== productId);

  if (req.session.cart.length === initialCartLength) {
    res.status(404).json({ error: "Product not found in cart" });
    return;
  }

  res.json({ message: "Product removed from cart", cart: req.session.cart });
});

export default router;
