// Librarys
import cors from "cors";
import express from "express";
import morgan from "morgan";
import morganBody from "morgan-body";

import path from "path";
import { fileURLToPath } from "url";
// Response Handler
import { ResHandler } from "./src/utils/Response/resHandler.js";
import { teacherRouter } from "./src/router/teacherRouter.js";
import { dogRouter, userRouter } from "./src/router/userRouter.js";
import { adminRouter } from "./src/router/adminRouter.js";
// import {ChatRouter} from "./Router/chatRouter.js";

export const filename = fileURLToPath(import.meta.url);
export const dirname = path.dirname(filename);

export let app = express();

const API_PreFix = "/api/v1";
const Auth_PreFix = "/auth";
const Teacher_PreFix = "/teacher";
const User_PreFix = "/user";
const Admin_PreFix = "/admin";
// const Event_PreFix = "/event";
// const Game_PreFix = "/game";

app.use("/public/uploads", express.static("./public/uploads"));

var corsOptions = {
  origin: "*",
};

app.use(express.json());
app.use(cors(corsOptions));

app.use(morgan("dev"));

morganBody(app, {
  prettify: true,
  logReqUserAgent: true,
  logReqDateTime: true,
});

// try {
//   Ffmpeg.setFfmpegPath(ffempgPath.path);
//   Ffmpeg.setFfprobePath(ffprobePath.path);
// } catch (error) {
//   console.log("Some error occured on ffempg");
// }
app.get("/", (req, res) => {
  return res.json({ message: "Welcome to DOG-SQUAD" });
});

// Root Routes
app.use(API_PreFix + Auth_PreFix + Teacher_PreFix, teacherRouter);
app.use(API_PreFix + Auth_PreFix + User_PreFix, userRouter);
app.use(API_PreFix + Auth_PreFix + Admin_PreFix, adminRouter);
app.use(API_PreFix + User_PreFix, dogRouter);
// app.use(API_PreFix + Category_PreFix, categoryRouter);
// app.use(API_PreFix + Event_PreFix, eventRouter);
// app.use(API_PreFix + Game_PreFix, gameRouter);

app.use(ResHandler);
