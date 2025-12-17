// models/Campaign.ts
import mongoose from "mongoose";

const CampaignSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    target: { type: Number, required: true },
 
    collected: { type: Number, default: 0 }, // Jumlah yang sudah terkumpul
    deadline: { type: String, default: "" }, // Batas waktu campaign
    
    image: { type: String, required: true },
    description: { type: String, required: true },

    location: { type: String, default: "-" },
    beneficiary: { type: String, required: true },
    duration: { type: String, default: "-" },

    details: { type: [String], default: [] },
    impact: { type: [String], default: [] },

    admin: { type: String, default: "Heartify" },
    contactPerson: { type: String, default: "-" },

    status: {
      type: String,
      enum: ["pending", "approved", "completed"],
      default: "pending",
    },

    completionDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Campaign ||
  mongoose.model("Campaign", CampaignSchema);