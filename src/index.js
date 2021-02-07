import { GraphQLServer, PubSub } from "graphql-yoga";
import Query from "./resolvers/Query";
import db from "./db";
import { dbData } from "./db/dbData";
import User from "./db/models/User";
import Mutation from "./resolvers/Mutation";

const server = new GraphQLServer({
  typeDefs: "./src/schema/schema.graphql",
  context: { dbData, User },
  resolvers: {
    Query,
    Mutation,
  },
});

server.start(() => {
  db();
  console.log("the server is up");
});
