import { Router } from "express";
import {
  registerAdmin,
  createProfile,
  assignDog,
} from "../controller/adminController.js";
import { checkBearer } from "../middleware/checkBearer.js";
import {  checkAuth } from "../middleware/checkAuth.js";
import { handleMultipartData } from "../middleware/handleMultipart.js";

export let adminRouter = Router();

adminRouter.route("/register").post([checkBearer, registerAdmin]);

adminRouter
  .route("/createProfile")
  .post([
    checkAuth,
    handleMultipartData.single("profilePicture"),
    createProfile,
  ]);
adminRouter.route("/assignDogsToTeacher").post([checkAuth, assignDog]);

