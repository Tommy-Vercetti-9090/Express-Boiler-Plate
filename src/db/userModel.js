import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: Schema.Types.String, requried: true },
    password: { type: Schema.Types.String, requried: true },
    country: { type: Schema.Types.String },
    city: { type: Schema.Types.String },
    name: { type: Schema.Types.String, requried: true },
    description: { type: Schema.Types.String, requried: true },
    age: { type: Schema.Types.String },

    userType: {
      type: Schema.Types.String,
      requried: true,
      enum: ["dog", "teacher", "admin"],
    },
    profilePicture: {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
    isAssigned: {
      type: Schema.Types.Boolean,
      default: false,
    },

    coverPicture: {
      type: Schema.Types.ObjectId,
      ref: "Media",
    },
    media: [
      {
        type: Schema.Types.ObjectId,
        ref: "Media",
      },
    ],
    devices: [
      {
        type: Schema.Types.ObjectId,
        ref: "Devices",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const UserModel = model("User", UserSchema);

export default UserModel;
