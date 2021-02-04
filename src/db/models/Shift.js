import Mongoose from "mongoose";

const shiftSchema = new mongoose.Schema(
  {
    day: { type: String },
    users: [{ type: Mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  },
  { timestamps: true }
);

export default Mongoose.model("Shift", shiftSchema);
