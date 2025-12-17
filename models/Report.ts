import mongoose, { Schema, models } from "mongoose";

const ReportSchema = new Schema(
  {
    title: String,
    category: String,
    amount: Number,
    image: String,
    description: String,
    details: [String],
    impact: [String],
    location: String,
    beneficiaries: String,
    duration: String,
    admin: String,
    contactPerson: String,
    completionDate: String,
  },
  { timestamps: true }
);

export default models.Report || mongoose.model("Report", ReportSchema);
