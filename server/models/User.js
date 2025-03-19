import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email: { type: String, unique: true, required: true },
    otp: { type: String, required: false },
    otpExpires: { type: Date, required: false },
    isVerified: { type: Boolean, default: false }
}, { timestamps: true });

const User = mongoose.model("User", UserSchema);

export default User;
