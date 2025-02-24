import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    code: string;
    name: string;
    description: string;
    image: string;
    category: string;
    price: number;
    quantity: number;
    internalReference: string;
    shellId: number;
    inventoryStatus: "INSTOCK" | "LOWSTOCK" | "OUTOFSTOCK";
    rating: number;
    createdAt: Date;
    updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
    {
      code: { type: String, required: true },
      name: { type: String, required: true },
      description: { type: String },
      image: { type: String },
      category: { type: String },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
      internalReference: { type: String },
      shellId: { type: Number },
      inventoryStatus: { type: String, enum: ["INSTOCK", "LOWSTOCK", "OUTOFSTOCK"], required: true },
      rating: { type: Number },
    },
    { timestamps: true }
);

export default mongoose.model<IProduct>("Product", ProductSchema);