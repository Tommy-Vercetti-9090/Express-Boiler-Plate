import MediaModel from "../db/mediaModel.js";
import UserModel from "../db/userModel.js";
import CustomError from "../utils/Response/CustomError.js";
import CustomSuccess from "../utils/Response/CustomSuccess.js";
import { hash, compare } from "bcrypt";
import { sendEmail } from "../utils/sendEmail.js";
import {
  templateForCredentials,
  forgetPasswordTemplate,
} from "../utils/htmlTemplate.js";
import devicesModel from "../db/devicesModel.js";
import { generateToken } from "../utils/generateToken.js";
import otpModel from "../db/otpModel.js";
import { randomInt } from "crypto";
import dogPerformanceModel from "../db/dogPerformanceModel.js";
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, age, country, city, description } = req.body;
    if (req.files.media.length == 0) {
      return next(
        CustomError.createError("Images or videos are requried", 409)
      );
    }
    const user = await UserModel.findOne({
      email: email,
      userType: "dog",
    });

    if (user) {
      return next(
        CustomError.createError("Dog with same email already exist", 409)
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
      userType: "dog",
    });
    let mediaId = [];

    await req.files.media.map(async (e) => {
      await MediaModel.create({
        mediaType: e.mimetype.split("/")[0],
        mediaUrl: e.path,
        userId: newUser._id,
      }).then((i) => {
        mediaId.push(i._id);
      });
    });

    const template = templateForCredentials(email, password);

    await sendEmail(email, "Account Credentials For Dog Squad", template);
    await UserModel.findByIdAndUpdate(newUser._id, {
      $set: { media: mediaId },
    });
    return next(
      CustomSuccess.createSuccess(newUser, "Dog registered successfully", 200)
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};
export const getAllDogs = async (req, res, next) => {
  try {
    const users = await UserModel.find({
      userType: "dog",
    })
      .populate([
        {
          path: "profilePicture",
          select: "mediaUrl",
        },
      ])
      .select("-password");
    return next(
      CustomSuccess.createSuccess(users, "All dogs fetched successfully", 200)
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};
export const login = async (req, res, next) => {
  try {
    const { email, password, deviceToken } = req.body;

    // await loginValidator.validateAsync(req.body);

    let user = await UserModel.findOne({ email });
    console.log(user);
    if (!user) {
      return next(CustomError.createError("User not found", 404));
    }
    const matchedPass = await compare(password, user.password);
    if (!matchedPass) {
      return next(
        CustomError.createError("Your Email or Password is incorrect", 400)
      );
    }

    const registerDevice = await new devicesModel({
      deviceToken,
      userId: user._id,
    }).save();

    user = await UserModel.findByIdAndUpdate(
      user._id,
      {
        $push: { devices: registerDevice._id },
      },
      { new: true }
    )
      .populate([
        {
          path: "profilePicture",
          select: "mediaUrl -_id",
        },
      ])
      .select("-password");

    const token = generateToken({
      id: user._id,
      email: user.email,
    });

    return next(
      CustomSuccess.createSuccess(
        {
          user: user,
          token: token,
        },
        "User logged in successfully",
        200
      )
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};

export const getProfileById = async (req, res, next) => {
  try {
    const userId = req.userId;

    const user = await UserModel.findById(userId)
      .populate([
        {
          path: "coverPicture",
          select: "mediaUrl",
        },
        {
          path: "profilePicture",
          select: "mediaUrl",
        },
        {
          path: "media",
          select: "mediaUrl",
        },
      ])
      .select("-password");
    return next(
      CustomSuccess.createSuccess(user, "Profile fetched successfully", 200)
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};
export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await UserModel.findOne({ email }).select("-password");
    if (!user) {
      return next(CustomError.createError("User does not exist", 404));
    }
    const otp = randomInt(1000, 9999);
    await otpModel.findOneAndUpdate(
      {
        userId: user._id,
        isUsed: false,
      },
      {
        otpKey: otp,
        expiry: new Date(Date.now() + 10 * 60 * 1000),
      },
      {
        upsert: true,
      }
    );
    const otpData = forgetPasswordTemplate(otp);
    const verificationEmail = await sendEmail(
      email,
      "Forget Password",
      otpData
    );
    if (verificationEmail) {
      return next(
        CustomSuccess.createSuccess(user, "OTP sent successfully", 200)
      );
    }
    return next(CustomError.createError("Otp not sent", 400));
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const { otpKey, userId } = req.body;

    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return next(CustomError.createError("User does not exist", 500));
    }
    const otp = await otpModel.findOne({ userId: userId });
    if (otpKey !== otp.otpKey.toString()) {
      return next(CustomError.createError("Invalid OTP", 400));
    }

    if (otp.isUsed) {
      return next(CustomError.createError("OTP already used", 400));
    }

    if (!otp || new Date() > otp.expiry) {
      return next(CustomError.createError("OTP expired", 400));
    }
    await otpModel.findByIdAndUpdate(otp._id, { isUsed: true });

    const token = generateToken({
      email: user.email,
      id: userId,
    });
    return next(
      CustomSuccess.createSuccess(
        { user, token },
        "OTP verified successfully",
        200
      )
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const { newPassword } = req.body;
    const userId = req.userId;
    const user = await UserModel.findById(userId).select("-password");
    if (!user) {
      return next(CustomError.createError("User does not exist", 500));
    }
    const isVerified = await otpModel.findOne({
      userId,
    });
    if (!isVerified.isUsed) {
      return next(CustomError.createError("Please verify OTP", 500));
    }
    const hashPass = await hash(newPassword, "$2b$12$OSHUicJPx99s9FVWucVZKu");
    await UserModel.findByIdAndUpdate(userId, {
      password: hashPass,
    });
    return next(
      CustomSuccess.createSuccess(user, "Password updated successfully", 200)
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const { newPassword, oldPassword } = req.body;
    const userId = req.userId;
    const user = await UserModel.findById(userId);
    if (!user) {
      return next(CustomError.createError("User does not exist", 404));
    }

    const passwordVerification = await compare(oldPassword, user.password);
    if (!passwordVerification) {
      return next(CustomError.createError("Incorrect password", 400));
    }
    const password = await hash(newPassword, "$2b$12$OSHUicJPx99s9FVWucVZKu");
    const updatedUser = await UserModel.findByIdAndUpdate(userId, {
      password,
    }).select("-password");
    return next(
      CustomSuccess.createSuccess(
        updatedUser,
        "Password reset successfully",
        200
      )
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};

export const addPerformance = async (req, res, next) => {
  try {
    const { performance, description } = req.body;
    let mediaId = [];
    console.log("req.files", req.files);
    console.log("req.file", req.file);

    if (req.files.media.length > 0) {
      await Promise.all(
        req.files.media.map(async (e) => {
          const media = await MediaModel.create({
            mediaType: e.mimetype.split("/")[0],
            mediaUrl: e.path,
            userId: req.userId,
          });

          mediaId.push(media._id);
        })
      );
    }

    const dogPerformance = await dogPerformanceModel.create({
      performance,
      description,
      media: mediaId,
      dogId: req.userId,
    });
    return next(
      CustomSuccess.createSuccess(
        dogPerformance,
        "Dog performance created successfully",
        200
      )
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};

export const getPerformance = async (req, res, next) => {
  try {
    const performance = await dogPerformanceModel
      .find({ dogId: req.userId })
      .populate({
        path: "media",
        select: "mediaUrl",
      });
    return next(
      CustomSuccess.createSuccess(
        performance,
        "Dog performance fetched successfully",
        200
      )
    );
  } catch (error) {
    return next(CustomError.createError(error.message, 500));
  }
};
