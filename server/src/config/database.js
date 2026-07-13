import mongoose from "mongoose";
import envConfig from "./env.js";

const connectDatabase = async () => {
  try {
    const conn = await mongoose.connect(envConfig.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Failed to connect database:", error);
    process.exit(1);
  }
};

export default connectDatabase;
