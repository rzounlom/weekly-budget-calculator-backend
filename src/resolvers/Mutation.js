const Mutation = {
  createUser: async (
    parent,
    { data: { username, password, role } },
    { User },
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
    { User },
    info
  ) => {
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
  deleteUser: async (parent, { id }, { User }, info) => {
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
};

export default Mutation;
