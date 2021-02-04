import Mongoose from "mongoose";

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true },
    firstName: { type: String, required: "Employee first name is required" },
    lastName: { type: String, required: "Employee last name is required" },
    postition: { type: String, required: "Employee position is required" },
    rate: { type: Number, required: "Employee rate is required" },
  },
  { timestamps: true }
);

export default Mongoose.model("Employee", employeeSchema);
