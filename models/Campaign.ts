import mongoose, { Schema, models } from "mongoose";

const CampaignSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    target: {
      type: Number,
      required: true,
    },
    collected: {
      type: Number,
      default: 0,
    },
    beneficiary: {
      type: String,
      required: true,
    },
    deadline: {
      type: Date,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default models.Campaign || mongoose.model("Campaign", CampaignSchema);
