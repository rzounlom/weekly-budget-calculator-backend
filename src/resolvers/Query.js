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
  findUserById: async (parent, { id }, { models: { User } }, info) => {
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
};

export default Query;
