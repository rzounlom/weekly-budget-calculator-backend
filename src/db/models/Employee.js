import Mongoose from "mongoose";

const employeeSchema = new Mongoose.Schema(
  {
    employeeId: {
      type: Number,
      unique: true,
      required: "Employee id is required",
    },
    firstName: { type: String, required: "Employee first name is required" },
    lastName: { type: String, required: "Employee last name is required" },
    position: { type: String, required: "Employee position is required" },
    rate: { type: Number, required: "Employee rate is required" },
  },
  { timestamps: true }
);
const Employee = Mongoose.model("Employee", employeeSchema);

export default Employee;
