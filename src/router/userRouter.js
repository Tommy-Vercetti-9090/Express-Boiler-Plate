import { Router } from "express";
import {
  addPerformance,
  changePassword,
  forgetPassword,
  getAllDogs,
  getPerformance,
  getProfileById,
  registerUser,
  resetPassword,
  verifyOtp,
} from "../controller/userController.js";
import { checkBearer } from "../middleware/checkBearer.js";
import { handleMultipartData } from "../middleware/handleMultipart.js";
import { checkAuth } from "../middleware/checkAuth.js";
import { login } from "../controller/userController.js";

export let userRouter = Router();
export let dogRouter = Router();

userRouter
  .route("/register")
  .post([
    checkBearer,
    handleMultipartData.fields([{ name: "media", maxCount: 6 }]),
    registerUser,
  ]);
userRouter.route("/login").post([checkBearer, login]);
userRouter.route("/getProfileById").get([checkAuth, getProfileById]);
userRouter.route("/forgetPassword").post([checkBearer, forgetPassword]);
userRouter.route("/verifyOtp").post([checkBearer, verifyOtp]);
userRouter.route("/changePassword").post([checkAuth, changePassword]);
userRouter.route("/resetPassword").post([checkAuth, resetPassword]);
dogRouter.route("/getAllDogs").get([checkAuth, getAllDogs]);
dogRouter
  .route("/addPerformance")
  .post([
    checkAuth,
    handleMultipartData.fields([{ name: "media", maxCount: 6 }]),
    addPerformance,
  ]);
dogRouter.route("/getPerformance").get([checkAuth, getPerformance]);
