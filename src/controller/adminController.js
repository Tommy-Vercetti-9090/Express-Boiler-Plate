import MediaModel from "../db/mediaModel.js";
import UserModel from "../db/userModel.js";
import CustomError from "../utils/Response/CustomError.js";
import CustomSuccess from "../utils/Response/CustomSuccess.js";
import { hash, compare } from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import { templateForCredentials } from "../utils/htmlTemplate.js";
import { generateToken } from "../utils/generateToken.js";
import devicesModel from "../db/devicesModel.js";
import assignDogModel from "../db/assignDogModel.js";
import { Types } from "mongoose";

export const registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const user = await UserModel.findOne({
      email: email,
      userType: "admin",
    });

    if (user) {
      return next(CustomError.createError("Account already exist", 409));
    }
    const hashPass = await hash(password, "$2b$12$OSHUicJPx99s9FVWucVZKu");
    const newUser = await UserModel.create({
      name,
      email,
      password: hashPass,
      userType: "admin",
    });
    const data = {
      email: email,
      id: newUser._id,
    };
    const token = generateToken(data);

    return next(
      CustomSuccess.createSuccess(
        { user: newUser, token: token },
        "Admin registered successfully",
        200
      )
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};
export const createProfile = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    const profilePic = await MediaModel.create({
      mediaType: "image",
      mediaUrl: req.file.path,
      userId: req.userId,
    });
    const user = await UserModel.findByIdAndUpdate(
      req.userId,
      {
        name,
        description,
        profilePicture: profilePic._id,
      },
      {
        new: true,
      }
    );
    if (!user) {
      return next(CustomError.createError("User does not exist", 500));
    }
    return next(
      CustomSuccess.createSuccess(user, "Profile created successfully", 200)
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};

export const assignDog = async (req, res, next) => {
  try {
    const { dogId, teacherId, startTime, endTime, startDate, endDate } =
      req.body;
    if (dogId.length == 0) {
      return next(CustomError.createError("Dogs not selected", 500));
    }
    dogId.map(async (e) => {
      await assignDogModel.create({
        dogId: new Types.ObjectId(e),
        teacherId,
        startTime,
        endTime,
        startDate,
        endDate,
      });
    });
    return next(
      CustomSuccess.createSuccess(
        "",
        "Dogs Assigned to teachers successfully",
        200
      )
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};
