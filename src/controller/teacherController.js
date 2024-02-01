import MediaModel from "../db/mediaModel.js";
import UserModel from "../db/userModel.js";
import CustomError from "../utils/Response/CustomError.js";
import CustomSuccess from "../utils/Response/CustomSuccess.js";
import { hash, compare } from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import { templateForCredentials } from "../utils/htmlTemplate.js";
import assignDogModel from "../db/assignDogModel.js";
import walkModel from "../db/walkModel.js";
export const register = async (req, res, next) => {
  try {
    const { name, email, password, country, city, description } = req.body;
    if (req.files.length == 0) {
      return next(
        CustomError.createError("Profile and cover pictures are requried", 409)
      );
    }
    const user = await UserModel.findOne({
      email: email,
      userType: "teacher",
    });

    if (user) {
      return next(
        CustomError.createError("Teacher with same email already exist", 409)
      );
    }
    const hashPass = await hash(password, "$2b$12$OSHUicJPx99s9FVWucVZKu");
    const newUser = await UserModel.create({
      name,
      email,
      password: hashPass,
      country,
      city,
      description,
      userType: "teacher",
    });
    const profilePic = await MediaModel.create({
      mediaType: "image",
      mediaUrl: req.files.profilePicture[0].path,
      userId: newUser._id,
    });
    const coverPic = await MediaModel.create({
      mediaType: "image",
      mediaUrl: req.files.coverPicture[0].path,
      userId: newUser._id,
    });
    await UserModel.findByIdAndUpdate(newUser._id, {
      profilePicture: profilePic._id,
      coverPicture: coverPic._id,
    });
    const template = templateForCredentials(email, password);

    await sendEmail(email, "Account Credentials For Dog Squad", template);

    return next(
      CustomSuccess.createSuccess(
        newUser,
        "Teacher registered successfully",
        200
      )
    );
  } catch (error) {
    console.log(error);
    return next(CustomError.createError(error.message, 500));
  }
};
export const getAllTeachers = async (req, res, next) => {
  try {
    const users = await UserModel.find({
      userType: "teacher",
    })
      .populate([
        {
          path: "profilePicture",
          select: "mediaUrl",
        },
      ])
      .select("-password");
    return next(
      CustomSuccess.createSuccess(
        users,
        "All teachers fetched successfully",
        200
      )
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};
export const getAssingedRequests = async (req, res, next) => {
  try {
    const requests = await assignDogModel
      .find({
        teacherId: req.userId,
        status: "pending",
      })
      .populate([
        {
          path: "dogId",
          select: "name description profilePicture country",
          populate: {
            path: "profilePicture",
            select: "mediaUrl",
          },
        },
      ]);
    return next(
      CustomSuccess.createSuccess(
        requests,
        "Assigned requests fetched successfully",
        200
      )
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};

export const acceptRequest = async (req, res, next) => {
  try {
    const { requestId } = req.query;
    const request = await assignDogModel.findByIdAndUpdate(
      requestId,
      {
        status: "Accepted",
      },
      {
        new: true,
      }
    );
    return next(
      CustomSuccess.createSuccess(request, "Request accepted successfully", 200)
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};

export const rejectRequest = async (req, res, next) => {
  try {
    const { requestId } = req.query;
    const request = await assignDogModel.findByIdAndUpdate(
      requestId,
      {
        status: "Rejected",
      },
      {
        new: true,
      }
    );
    return next(
      CustomSuccess.createSuccess(request, "Request rejected successfully", 200)
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};
export const addWalk = async (req, res, next) => {
  try {
    const { title, dogId, date, time, duration } = req.body;
    const walk = await walkModel.create({
      title,
      dogId,
      date,
      time,
      duration,
      teacherId: req.userId,
    });
    return next(
      CustomSuccess.createSuccess(walk, "Walk added successfully", 200)
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};

export const getWalk = async (req, res, next) => {
  try {
    const { dogId, date } = req.query;
    const walk = await walkModel.find({
      dogId,
      teacherId: req.userId,
      date: date,
    });
    return next(
      CustomSuccess.createSuccess(walk, "Walk fetched successfully", 200)
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};
// track trsaining screen
export const getTodayWalk = async (req, res, next) => {
  try {
    const { dogId, date } = req.query;
    const walk = await walkModel.find({
      dogId,
      teacherId: req.userId,
      date: date,
    });
    let totalDuration = 0;
    walk.
      map((e) => {
        totalDuration = totalDuration + e.duration;
      });
    return next(
      CustomSuccess.createSuccess(
        totalDuration,
        "Today's walk fetched successfully",
        200
      )
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};
