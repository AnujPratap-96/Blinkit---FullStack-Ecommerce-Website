import { Router } from "express";
import {
  loginUserController,
  logoutUserController,
  registerUserController,
  verifyEmailController,
  uploadUserAvatarController,
  updateUserController,
  forgotUserPasswordController,
  verifyForgotUserPasswordOtp,
  resetUserPassword,
  userRefreshToken,
  userDetails,
} from "../controllers/user.controller.js";
import auth from "../middlewares/auth.js";
import upload from "../middlewares/multer.js";

const userRouter = Router();

userRouter.post("/register", registerUserController);
userRouter.post("/verify-email", verifyEmailController);
userRouter.post("/login", loginUserController);
userRouter.get("/logout", auth, logoutUserController);
userRouter.put(
  "/upload-avatar",
  auth,
  upload.single("avatar"),
  uploadUserAvatarController
);
userRouter.put("/update-user", auth, updateUserController);
userRouter.put("/forgot-password", forgotUserPasswordController);
userRouter.put("/verify-forgot-password-otp", verifyForgotUserPasswordOtp);
userRouter.put("/reset-password", resetUserPassword);
userRouter.post("/refresh-token", userRefreshToken);
userRouter.get("/user-details", auth, userDetails);

export default userRouter;
