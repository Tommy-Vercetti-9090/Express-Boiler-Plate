import { Schema, model } from "mongoose";

export default model(
  "Performance",
  new Schema(
    {
      dogId: { type: Schema.Types.ObjectId, ref: "User", required: true },
      performance: { type: Schema.Types.String, required: true },
      description: { type: Schema.Types.String, required: true },
      media: [{ type: Schema.Types.ObjectId, ref: "Media" }],
    },
    {
      timestamps: true,
    }
  )
);
