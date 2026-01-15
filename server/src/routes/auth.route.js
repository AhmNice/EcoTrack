import express from "express";
import {
  changePassword,
  createUser,
  getAllUsers,
  getAuthenticatedUser,
  getUserById,
  login,
  logout,
  requestResetPasswordLink,
  resetPassword,
  toggleStatus,
  updateUser,
  verifyOTP,
} from "../controller/auth.controller.js";
import {
  changePasswordValidator,
  createUserValidator,
  handleInputValidation,
  loginValidator,
  otpValidator,
  resetPasswordLinkValidator,
  resetPasswordValidator,
  updateProfileValidator,
} from "../middleware/validator.js";
import { rateLimiter } from "../middleware/rateLimiter.js";
import { secureRoute } from "../middleware/secureRoute.js";
import { adminRoute, userRoute } from '../middleware/protectedRoute.js'
import { param, body } from "express-validator";
const authRoute = express.Router();

authRoute.post(
  "/create-user",
  rateLimiter,
  createUserValidator,
  handleInputValidation,
  createUser
);
authRoute.post("/admin/create-user", rateLimiter,
  createUserValidator,
  handleInputValidation,
  adminRoute(),
  createUser)
authRoute.post("/otp-verification", otpValidator, handleInputValidation, verifyOTP)
authRoute.post(
  "/login",
  rateLimiter,
  loginValidator,
  handleInputValidation,
  login
);
authRoute.post(
  "/change-password",
  secureRoute,
  changePasswordValidator,
  handleInputValidation,
  changePassword
);
authRoute.post(
  "/request-password-reset-link",
  rateLimiter,
  resetPasswordLinkValidator,
  handleInputValidation,
  requestResetPasswordLink
);
authRoute.patch(
  "/reset-password",
  rateLimiter,
  resetPasswordValidator,
  handleInputValidation,
  resetPassword
);
authRoute.patch("/status/toggle/:user_id", [param("user_id").trim().notEmpty().withMessage("User id is required").escape()], handleInputValidation, adminRoute(), toggleStatus)
authRoute.get("/users/get-user/:user_id", [param("user_id").trim().notEmpty().withMessage("User id is required").escape()], handleInputValidation, adminRoute(), getUserById)
authRoute.get("/users/get-all-users", adminRoute(), getAllUsers)
authRoute.patch("/update-profile/:user_id", userRoute(), updateProfileValidator, handleInputValidation, updateUser)
authRoute.get("/get-authenticated-user", secureRoute, getAuthenticatedUser);
authRoute.post("/logout", secureRoute, logout);
export default authRoute;
