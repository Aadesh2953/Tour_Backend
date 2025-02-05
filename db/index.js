import mongoose from "mongoose";

export const connectToDb = async () => {
  try {
    console.log('called')
    const connection = await mongoose.connect('mongodb+srv://Aadesh:HbicFpIKtnUCrqrk@cluster0.zxqjo.mongodb.net/');
    console.log("Connection Object:", connection.connection.host);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1); // Exit the process with a failure code
  }
};
