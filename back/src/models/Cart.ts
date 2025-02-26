import mongoose, { Document, Schema } from 'mongoose';

// Interface pour un élément du panier
interface CartItem {
    quantity: number;
    product: mongoose.Types.ObjectId; // Utilisation de Types.ObjectId
}

// Interface pour le modèle Cart
interface Cart extends Document {
    userId: mongoose.Types.ObjectId; // Utilisation de Types.ObjectId
    items: CartItem[];
}

// Schéma pour un élément du panier
const CartItemSchema = new Schema<CartItem>({
    quantity: { type: Number, required: true },
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true } // Correction ici
});

// Schéma pour le modèle Cart
const CartSchema = new Schema<Cart>({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Correction ici
    items: [CartItemSchema]
});

export default mongoose.model<Cart>('Cart', CartSchema);
