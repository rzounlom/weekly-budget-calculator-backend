import generateToken from "../utils/generateToken";
import bcrypt from "bcrypt";

const Query = {
  hello: () => {
    return "Hello, I am alive";
  },
  users: async (parent, args, { User }, info) => {
    if (args.query) {
      const foundUser = User.find({
        username: new RegExp(args.query, "i"),
      });
      return foundUser;
    } else {
      return User.find({});
    }
  },
  loginUser: async (parent, args, { User }, info) => {
    const { username, password } = args.data;
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
  findUserById: async (parent, { id }, { User }, info) => {
    const user = User.findById({ _id: id });
    return user;
  },
};

export default Query;
