import Mongoose from "mongoose";

const Mutation = {
  createUser: async (
    parent,
    { data: { username, password, role } },
    { models: { User } },
    info
  ) => {
    const userExists = await User.findOne({ username: username });

    //handle error if email is already taken
    if (userExists) {
      throw new Error("Username already in use");
    }

    //create new user object to add to db
    const user = new User({
      username,
      password,
      role,
    });

    //save user to db
    const newUser = await user.save();

    //return user to client
    return newUser;
  },
  updateUser: async (
    parent,
    { data: { id, username, password, role } },
    { models: { User } },
    info
  ) => {
    const idValid = Mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
      throw new Error("User not found");
    }

    const user = await User.findById({ _id: id });
    if (!user) {
      throw new Error("User Not Found");
    }

    user.username = username || user.username;
    user.password = password || user.password;
    user.role = role || user.role;

    const updatedUser = await user.save();
    return updatedUser;
  },
  deleteUser: async (parent, { id }, { models: { User } }, info) => {
    const idValid = Mongoose.Types.ObjectId.isValid(id);
    if (!idValid) {
      throw new Error("User not found");
    }

    const user = await User.findById({ _id: id });
    if (!user) {
      throw new Error("User Not Found");
    }

    try {
      await User.deleteOne({ _id: id });
    } catch (err) {
      if (err) {
        throw new Error(err);
      }
    }
    return { message: `User: ${user.username} Deleted` };
  },
  createEmployee: async (
    parent,
    { data: { employeeId, firstName, lastName, position, rate } },
    { models: { Employee } },
    info
  ) => {
    const employeeExists = await Employee.findOne({ employeeId });

    //handle error if email is already taken
    if (employeeExists) {
      throw new Error(`Employee with id ${employeeId}  already exsists`);
    }

    //create new user object to add to db
    const employee = new Employee({
      employeeId,
      firstName,
      lastName,
      position,
      rate,
    });

    //save user to db
    const newEmployee = await employee.save();

    //return user to client
    return newEmployee;
  },
  updateEmployee: async (
    parent,
    { employeeId, data: { firstName, lastName, position, rate } },
    { models: { Employee } },
    info
  ) => {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      throw new Error("Employee Not Found");
    }
    firstName
      ? (employee.firstName = firstName)
      : (employee.firstName = employee.firstName);
    lastName
      ? (employee.lastName = lastName)
      : (employee.lastName = employee.lastName);
    position
      ? (employee.position = position)
      : (employee.position = employee.position);
    rate ? (employee.rate = rate) : (employee.rate = employee.rate);

    const updatedEmployee = await employee.save();
    return updatedEmployee;
  },
  deleteEmployee: async (
    parent,
    { employeeId },
    { models: { Employee } },
    info
  ) => {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      throw new Error("Employee Not Found");
    }

    try {
      await Employee.deleteOne({ _id: employee._id });
    } catch (err) {
      if (err) {
        throw new Error(err);
      }
    }
    return {
      message: `Employee: ${employee.firstName} ${employee.lastName} with employee id ${employeeId} Deleted`,
    };
  },
  createShift: async (
    parent,
    { data: { day, employeeId, hours } },
    { models: { Shift, Employee } },
    info
  ) => {
    //find employee
    const employee = await Employee.findOne({ employeeId });

    //throw error if employee does not exists
    if (!employee) {
      throw new Error("Employee not found");
    }

    let existingShift;
    //check to see if employee already added to shift with day
    existingShift = await Shift.findOne({
      $and: [{ day }, { employee: employee._id }],
    });

    if (existingShift) {
      if (
        JSON.stringify(existingShift.employee) === JSON.stringify(employee._id)
      ) {
        throw new Error(
          `Employee ${employee.firstName} ${employee.lastName} with employee id ${employeeId} already added to ${day} shift`
        );
      }
    } else {
      const shift = new Shift({
        employee: employee,
        hours,
        day,
      });
      await shift.save();
      return shift;
    }
  },
  updateShift: async (
    parent,
    { data: { day, hours, employeeId } },
    { models: { Shift, Employee } },
    info
  ) => {
    //find employee
    const employee = await Employee.findOne({ employeeId });

    //throw error if employee does not exists
    if (!employee) {
      throw new Error("Employee not found");
    }

    let existingShift;
    //check to see if employee already added to shift with day
    existingShift = await Shift.findOne({
      $and: [{ day }, { employee: employee._id }],
    });

    if (!existingShift) {
      throw new Error("Shift not found");
    } else {
      existingShift.hours = hours;
      existingShift.day = day;

      //save updated shift
      const updatedShift = await existingShift.save();

      return updatedShift;
    }
  },
  deleteSingleShift: async (
    parent,
    { data: { day, employeeId } },
    { models: { Shift, Employee } },
    info
  ) => {
    //find employee
    const employee = await Employee.findOne({ employeeId });

    //throw error if employee does not exists
    if (!employee) {
      throw new Error("Employee not found");
    }

    let existingShift;
    //check to see if employee already added to shift with day
    existingShift = await Shift.findOne({
      $and: [{ day }, { employee: employee._id }],
    });

    if (!existingShift) {
      throw new Error("Shift not found");
    } else {
      //delete shift
      await existingShift.deleteOne();

      return {
        message: `Employee ${employee.firstName} ${employee.lastName} with employee id ${employeeId} deleted from ${day} shift`,
      };
    }
  },
  deleteShiftsByDay: async (parent, { day }, { models: { Shift } }, info) => {
    //find all shifts based on day
    const shifts = await Shift.find({ day });

    //return error if not shifts exist
    if (shifts.length < 1) {
      throw new Error(`No employees added to ${day} shift yet`);
    }

    // console.log(`shifts: ${shifts}`);

    //if found, delete all shifts
    await Shift.deleteMany({ day });

    return {
      message: `${shifts.length} employees removed from ${day} shift`,
    };
  },
};

export default Mutation;
