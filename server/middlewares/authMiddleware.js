import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.json({ success: false, message: "token doesn't exist" });
    }
    const decoded = jwt.verify(token, process.env.SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.json({ success: false, message: "user not verified" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};
