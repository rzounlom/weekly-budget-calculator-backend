const Mutation = {
  createUser: async (parent, args, { User }, info) => {
    const userExists = await User.findOne({ username: args.data.username });
    console.log(userExists);

    //handle error if email is already taken
    if (userExists) {
      throw new Error("Username already in use");
    }

    //create new user object to add to db
    const user = new User({
      ...args.data,
    });

    //save user to db
    await user.save();

    //return user to client
    return user;
  },
};

export default Mutation;
