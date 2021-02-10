import Mongoose from "mongoose";

const shiftSchema = new Mongoose.Schema(
  {
    day: { type: String },
    employee: { type: Mongoose.Schema.Types.ObjectId, ref: "Employee" },
    hours: { type: Number, required: "Hours is required" },
  },
  { timestamps: true }
);

const Shift = Mongoose.model("Shift", shiftSchema);
export default Shift;
