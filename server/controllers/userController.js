import { createToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { email, password, fullName, bio } = req.body;

    if (!email || !password || !fullName || !bio) {
      return res.json({ success: false, message: "Cred missing" });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res.json({ success: false, message: "Acc exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      bio,
      password: hashedPassword,
    });

    const token = createToken(newUser._id);

    res.json({
      success: true,
      message: "Acc created",
      userData: newUser.token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
