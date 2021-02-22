import generateToken from "../utils/generateToken";
import bcrypt from "bcrypt";
import Mongoose from "mongoose";

const Query = {
  findUsers: async (parent, { query }, { models: { User } }, info) => {
    if (query) {
      const foundUser = User.find({
        username: new RegExp(query, "i"),
      });
      return foundUser;
    } else {
      return User.find({});
    }
  },
  loginUser: async (
    parent,
    { data: { username, password } },
    { models: { User } },
    info
  ) => {
    const user = await User.findOne({ username: username });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    //check if passwords match
    const passwordsMatch = bcrypt.compareSync(password, user.password);

    if (!passwordsMatch) {
      throw new Error("Invalid Credentials");
    }

    const token = generateToken(user._id);
    return { token };
  },
  user: async (parent, { id }, { models: { User } }, info) => {
    const idValid = Mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
      throw new Error("User not found");
    }

    const user = await User.findById({ _id: id });
    if (!user) {
      throw new Error("User not found");
    }

    return user;
  },
  findEmployees: async (parent, { query }, { models: { Employee } }, info) => {
    if (query) {
      const foundEmployee = Employee.find({
        firstName: new RegExp(query, "i"),
      });
      return foundEmployee;
    } else {
      return Employee.find({});
    }
  },
  findEmployeeById: async (parent, { id }, { models: { Employee } }, info) => {
    const idValid = Mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
      throw new Error("Employee not found");
    }

    const employee = await Employee.findById({ _id: id });
    if (!employee) {
      throw new Error("Employee not found");
    }

    return employee;
  },
  findShifts: async (parent, args, { models: { Shift, Employee } }, info) => {
    try {
      const shifts = await Shift.find({}).map(async (shift) => {
        const employee = await Employee.findOne({ _id: shift.employee });
        // console.log(`employee: ${employee}`);
        shift.employee = employee;
        // console.log(shift);
        return shift;
      });

      const shiftEmployees = shifts.map(async (shift) => {
        const employee = await Employee.findOne({ _id: shift.employee });
        // console.log(`employee: ${employee}`);
        shift.employee = employee;
        // console.log(shift);
        return shift;
      });
      // console.log(shiftEmployees);
      return shiftEmployees;
    } catch (err) {
      if (err) throw new Error(err);
    }
  },

  findShiftsByDay: async (
    parent,
    { day },
    { models: { Shift, Employee } },
    info
  ) => {
    try {
      const shifts = await Shift.find({ day }).map(async (shift) => {
        const employee = await Employee.findOne({ _id: shift.employee });
        // console.log(`employee: ${employee}`);
        shift.employee = employee;
        // console.log(shift);
        return shift;
      });

      const shiftEmployees = shifts.map(async (shift) => {
        const employee = await Employee.findOne({ _id: shift.employee });
        // console.log(`employee: ${employee}`);
        shift.employee = employee;
        // console.log(shift);
        return shift;
      });
      return shiftEmployees;
    } catch (err) {
      if (err) throw new Error(err);
    }
  },
};

export default Query;
