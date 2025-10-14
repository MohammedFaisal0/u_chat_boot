// models/Faculty.js
import mongoose from "mongoose";

const FacultySchema = new mongoose.Schema({
  faculty_id: { type: Number, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  account: { type: mongoose.Schema.Types.ObjectId, ref: "Account" },
});

export default mongoose.models.Faculty || mongoose.model("Faculty", FacultySchema);



