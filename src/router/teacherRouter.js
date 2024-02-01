import { Router } from "express";
import {
  acceptRequest,
  addWalk,
  getAllTeachers,
  getAssingedRequests,
  getWalk,
  register,
  rejectRequest,
} from "../controller/teacherController.js";
import { checkBearer } from "../middleware/checkBearer.js";
import { handleMultipartData } from "../middleware/handleMultipart.js";
import { checkAuth } from "../middleware/checkAuth.js";

export let teacherRouter = Router();

teacherRouter
  .route("/register")
  .post([
    checkBearer,
    handleMultipartData.fields([
      { name: "profilePicture" },
      { name: "coverPicture" },
    ]),
    register,
  ]);
teacherRouter.route("/getAllTeachers").get([checkAuth, getAllTeachers]);

teacherRouter
  .route("/getAssignedRequests")
  .get([checkAuth, getAssingedRequests]);

teacherRouter.route("/acceptRequest").post([checkAuth, acceptRequest]);
teacherRouter.route("/rejectRequest").post([checkAuth, rejectRequest]);
teacherRouter.route("/addWalk").post([checkAuth, addWalk]);
teacherRouter.route("/getWalk").get([checkAuth, getWalk]);
// authRouter.route("/login").post([checkBearer, login]);
// authRouter.route("/verify-otp").post([checkBearer, verifyOtp]);
// authRouter.route("/resend-otp").post([checkBearer, resendOtp]);
// authRouter.route("/change-password").post([checkAuth, changePassword]);
// authRouter.route("/forget-password").post([checkBearer, forgetPassword]);
// authRouter
//   .route("/verify-otp-forgetPassword")
//   .post([checkBearer, verifyOtpForgetPassword]);

// authRouter.route("/reset-password").post([checkAuth, resetPassword]);
// authRouter
//   .route("/resend-otp-forget-password")
//   .post([checkBearer, resendOtpForgetPassword]);
// authRouter.route("/social-login").post([checkBearer, socialLogin]);
// authRouter.route("/guest-login").post([checkBearer, loginAsGuest]);
// authRouter.route("/verify-token").post([checkAuth, verifyToken]);
// authRouter.route("/delete-account").post([checkAuth, deleteAccount]);
