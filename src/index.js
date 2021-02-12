import { ApolloServer } from "apollo-server-express";
import cors from "cors";
import express from "express";
import Query from "./resolvers/Query";
import db from "./db";
import { dbData } from "./db/dbData";
import User from "./db/models/User";
import Shift from "./db/models/Shift";
import Employee from "./db/models/Employee";
import Day from "./db/models/Day";
import Mutation from "./resolvers/Mutation";
import typeDefs from "./schema/schema";
import generateToken from "./utils/generateToken";
import bcrypt from "bcrypt";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 5000;

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers: {
    Query,
    Mutation,
  },
  context: { dbData, models: { User, Shift, Employee, Day } },
});

apolloServer.applyMiddleware({ app, path: `/graphql` });

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username: username });
  if (!user) {
    res.status(401).json({ error: "Invalid Credentials" });
    return;
  }

  //check if passwords match
  const passwordsMatch = bcrypt.compareSync(password, user.password);

  if (!passwordsMatch) {
    throw new Error("Invalid Credentials");
  }

  const token = generateToken(user._id);
  return res.status(200).json({ token });
});

app.listen(PORT, () => {
  db();
  console.info(`Server started on port ${PORT}`);
});
