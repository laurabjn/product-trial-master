import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    username: string;
    firstname: string;
    email: string;
    password: string;
    isAdmin: boolean;
}

const UserSchema = new Schema<IUser>({
    username: { type: String, required: true },
    firstname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
});

export default mongoose.model<IUser>("User", UserSchema);