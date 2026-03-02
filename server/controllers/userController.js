import cloudinary from "../lib/cloudinary.js";
import { createToken } from "../lib/utils.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { email, password, fullName, bio } = req.body;

    if (!email || !password || !fullName || !bio) {
      return res.status(400).json({ success: false, message: "Cred missing" });
    }
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: "Acc exists" });
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
    

    res.status(201).json({
      success: true,
      message: "Acc created",
      userData: newUser,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(400).json({ success: false, message: "Acc doesn't exist" });
    }

    const isMatch = await bcrypt.compare(password, userData.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: "password doesn't match" });
    }

    const token = createToken(userData._id);

    res.status(200).json({
      success: true,
      message: "Login successfull",
      token,
      userData: userData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const checkAuth = (req, res) => {
  res.status(200).json({ success: true, user: req.user });
};

export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;

    const userId = req.user._id;

    let updatedUser;

    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { fullName, bio },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );

     
    }
    return  res.json({
        success: true,
        message: "user updated successfully",
        user: updatedUser,
      });
  } catch (error) {
    console.log(error);
    return res.json({ success: false, message: error.message });
  }
};
