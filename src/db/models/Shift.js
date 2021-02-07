import Mongoose from "mongoose";

const shiftSchema = new Mongoose.Schema(
  {
    day: { type: String },
    users: [{ type: Mongoose.Schema.Types.ObjectId, ref: "Employee" }],
  },
  { timestamps: true }
);

const Shift = Mongoose.model("Shift", shiftSchema);
export default Shift;
