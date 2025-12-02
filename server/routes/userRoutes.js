import express from "express"
import { checkAuth, login, signUp, updateProfile } from "../controllers/userController.js"
import { authMiddleware } from "../middlewares/authMiddleware.js";

const userRouter=express.Router()

userRouter.post("/register",signUp);
userRouter.post("/login",login)
userRouter.get("/check",authMiddleware,checkAuth)
userRouter.put("/update-profile",authMiddleware,updateProfile)
export default userRouter;