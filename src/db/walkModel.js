import { Schema, model } from "mongoose";

export default model(
  "WalkModel",
  new Schema(
    {
      dogId: { type: Schema.Types.ObjectId, ref: "User" },
      teacherId: { type: Schema.Types.ObjectId, ref: "User" },
      title: { type: Schema.Types.String, required: true },
      date: { type: Schema.Types.String, required: true },
      time: { type: Schema.Types.String, required: true },
      duration: { type: Schema.Types.String, required: true },
    },
    {
      timestamps: true,
    }
  )
);
