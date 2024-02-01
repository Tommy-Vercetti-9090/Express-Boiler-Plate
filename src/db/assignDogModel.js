import { Schema, model } from "mongoose";

export default model(
  "AssignedDogs",
  new Schema(
    {
      dogId: { type: Schema.Types.ObjectId, ref: "User" },
      teacherId: { type: Schema.Types.ObjectId, ref: "User" },
      startTime: { type: Schema.Types.String, required: true },
      endTime: { type: Schema.Types.String, required: true },
      startDate: { type: Schema.Types.String, required: true },
      endDate: { type: Schema.Types.String, required: true },
      status: {
        type: Schema.Types.String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
      },
    },
    {
      timestamps: true,
    }
  )
);
