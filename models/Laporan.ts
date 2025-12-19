import mongoose, { Schema, model, models } from "mongoose";

const LaporanSchema = new Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  target: { type: Number, required: true },
  completionDate: { type: Date, required: true },
  beneficiary: { type: String, required: true },
  duration: { type: String, required: true },
  description: { type: String, required: true },
  details: { type: [String], default: [] },
  impact: { type: [String], default: [] },
  admin: { type: String, required: true },
  contactPerson: { type: String },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Laporan = models.Laporan || model("Laporan", LaporanSchema);
export default Laporan;