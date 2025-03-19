import User from "../models/User.js";

export const getProfile = async (req,res)=>{
    const user = req.user;
    res.status(200).json({message:"user profile",user})
}

export const searchUserByEmail = async (req, res) => {
    const { email } = req.query;
    
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ user: { _id: user._id, email: user.email, name: user.name } });
}

