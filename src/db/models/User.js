import Mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    firstName: { type: String, required: "Employee first name is required" },
    lastName: { type: String, required: "Employee last name is required" },
    role: { type: String, default: "user" },
  },
  { timestamps: true }
);

export default Mongoose.model("User", userSchema);
