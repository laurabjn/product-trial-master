import express, { Request, Response } from "express";
import Cart from "../models/Cart";
import { authMiddleware, AuthRequest } from "../middleware/authMiddleware";

const router = express.Router();

/**
 * @swagger
 * /cart:
 *   get:
 *     summary: Get the user's cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Returns the user's cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.get("/", authMiddleware, async (req: any, res) => {
  console.log("get cart");
  try {
    const cart = await Cart.findOne({ userId: req.user.userId }).populate("items.product");
    console.log("cart", cart);
    res.json(cart || { userId: req.user.userId, items: [] });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product to add
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product
 *     responses:
 *       200:
 *         description: Item added to cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.post("/", authMiddleware, async (req: any, res) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      cart = new Cart({ userId: req.user.userId, items: [] });
    }

    const existingItem = cart.items.find((item: any) => item.product.toString() === productId);
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /cart/{productId}:
 *   put:
 *     summary: Update the quantity of a product in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         description: ID of the product to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: New quantity of the product
 *                 example: 3
 *     responses:
 *       200:
 *         description: Product quantity updated successfully
 *       404:
 *         description: Product not found in cart
 *       500:
 *         description: Internal server error
 */
router.put("/:productId", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity < 1) {
      res.status(400).json({ error: "Quantity must be at least 1" });
      return;
    }

    // Trouver le panier de l'utilisateur
    const cart = await Cart.findOne({ userId: req.user!.userId });

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
      return;
    }

    // Trouver le produit dans le panier
    const product = cart.items.find((item) => item.product.toString() === productId);

    if (!product) {
      res.status(404).json({ error: "Product not found in cart" });
      return;
    }

    // Mettre à jour la quantité
    product.quantity = quantity;

    // Sauvegarder les modifications
    await cart.save();

    res.json({ message: "Product quantity updated successfully", cart });
  } catch (error) {
    console.error("Error updating product quantity in cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /cart/clear:
 *   delete:
 *     summary: Clear the user's cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *       404:
 *         description: Cart not found
 *       500:
 *         description: Internal server error
 */
router.delete("/clear", authMiddleware, async (req: any, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.user.userId });

    if (!cart) {
      res.status(404).json({ error: "Cart not found" });
    }

    cart!.items = [];
    await cart!.save();

    res.json({ message: "Cart cleared successfully" });
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

/**
 * @swagger
 * /cart/{productId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags: [Cart]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to remove
 *     responses:
 *       200:
 *         description: Item removed from cart
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 */
router.delete("/:productId", authMiddleware, async (req: any, res) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ userId: req.user.userId });

    if (cart) {
      cart.items = cart.items.filter((item: any) => item.product.toString() !== productId);
      await cart.save();
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
