import Mongoose from "mongoose";

const daySchema = new Mongoose.Schema(
  {
    day: { type: String, unique: true },
    shifts: [{ type: Mongoose.Schema.Types.ObjectId, ref: "Shift" }],
  },
  { timestamps: true }
);
const Day = Mongoose.model("Day", daySchema);

export default Day;
