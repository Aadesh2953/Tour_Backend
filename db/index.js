import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    // console.log("Connection Object:", connection.connection.host);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1); // Exit the process with a failure code
  }
};
