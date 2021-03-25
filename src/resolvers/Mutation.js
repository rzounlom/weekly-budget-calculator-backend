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
    return { message: `New user ${newUser.username} successfully created` };
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
    return { message: `User ${updatedUser.username} successfully updated` };
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
    return { message: `User ${user.username} deleted` };
  },
  deleteAllUsers: async (parent, args, { models: { User } }, info) => {
    try {
      const usersToDelete = await User.find({ role: "USER" });

      if (usersToDelete.length === 0) {
        throw new Error(`No user(s) with role "USER" to delete`);
      } else {
        await User.deleteMany({ role: "USER" });
        return {
          message: `${usersToDelete.length} user(s) with role "USER" successfully deleted`,
        };
      }
    } catch (errors) {
      if (errors) {
        throw new Error(errors);
      }
    }
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
      throw new Error(`Employee with id ${employeeId} already exsists`);
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
    return {
      message: `Successfully added employee ${newEmployee.firstName} ${newEmployee.lastName}`,
    };
  },
  updateEmployee: async (
    parent,
    { employeeId, data: { firstName, lastName, position, rate } },
    { models: { Employee, Shift } },
    info
  ) => {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      throw new Error("Employee not found");
    }

    try {
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

      return {
        message: `Employee: ${updatedEmployee.firstName} ${updatedEmployee.lastName} successfully updated`,
      };
    } catch (errors) {
      if (errors) {
        throw new Error(errors);
      }
    }
  },
  deleteEmployee: async (
    parent,
    { employeeId },
    { models: { Employee, Shift } },
    info
  ) => {
    const employee = await Employee.findOne({ employeeId });
    if (!employee) {
      throw new Error("Employee not found");
    }

    try {
      await Employee.deleteOne({ _id: employee._id });
      await Shift.deleteMany({ employee: employee._id });
    } catch (errors) {
      if (errors) {
        throw new Error(errors);
      }
    }
    return {
      message: `Employee: ${employee.firstName} ${employee.lastName} successfully deleted`,
    };
  },
  deleteAllEmployees: async (
    parent,
    args,
    { models: { Shift, Employee } },
    info
  ) => {
    try {
      const employeesToDelete = await Employee.find({});
      const shiftsToDelete = await Shift.find({});
      if (employeesToDelete.length === 0) {
        throw new Error(`No Employees to Delete`);
      } else {
        await Employee.deleteMany({});
        await Shift.deleteMany({});
        return {
          message: `${employeesToDelete.length} Employees and ${shiftsToDelete.length} Employee shifts successfully deleted`,
        };
      }
    } catch (errors) {
      if (errors) {
        throw new Error(errors);
      }
    }
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
      return {
        message: `Successfully created ${day} shift for ${employee.firstName} ${employee.lastName}`,
      };
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

      return {
        message: `${day} shift successfully updated for ${employee.firstName} ${employee.lastName}`,
      };
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
        message: `Employee ${employee.firstName} ${employee.lastName} successfully deleted from ${day} shift`,
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
      message: `${shifts.length} employee(s) successfully removed from ${day} shift`,
    };
  },
};

export default Mutation;
