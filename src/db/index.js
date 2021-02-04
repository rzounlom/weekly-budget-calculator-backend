import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const db = () => {
  try {
    mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("connected to db");
  } catch (error) {
    console.error(error);
    return new Error("Unable to connected to DB");
  }
};

export default db;
