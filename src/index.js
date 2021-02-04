import { GraphQLServer, PubSub } from "graphql-yoga";
import Query from "./resolvers/Query";
import db from "./db";

const server = new GraphQLServer({
  typeDefs: "./src/schema/schema.graphql",
  context: {},
  resolvers: {
    Query,
  },
});

server.start(() => {
  db();
  console.log("the server is up");
});
