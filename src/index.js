import { GraphQLServer, PubSub } from "graphql-yoga";
import Query from "./resolvers/Query";
import db from "./db";
import { dbData } from "./db/dbData";
import User from "./db/models/User";
import Shift from "./db/models/Shift";
import Employee from "./db/models/Employee";
import Day from "./db/models/Day";
import Mutation from "./resolvers/Mutation";

const server = new GraphQLServer({
  typeDefs: "./src/schema/schema.graphql",
  context: { dbData, models: { User, Shift, Employee, Day } },
  resolvers: {
    Query,
    Mutation,
  },
});

server.start(() => {
  db();
  console.log("the server is up");
});
