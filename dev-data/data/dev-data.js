import mongoose from "mongoose";
import fs from "fs"
import dotenv from 'dotenv'
import { Tour } from "../../models/TourModel.js";
dotenv.config({ path: './config.env' });
export const connectToDb = async () => {
  try {
    const connection = await mongoose.connect(process.env.DATABASE_URL);
    console.log("Connection Object:", connection.connection.host);
  } catch (error) {
    console.error(`Database connection failed: ${error.message}`);
    process.exit(1); // Exit the process with a failure code
  }
};
connectToDb().then(()=>
console.log("Mongo DB connected!!!"))
      async function importDevData()
      {
        const data=JSON.parse(fs.readFileSync(`dev-data/data/tours-simple.json`,"utf-8"))
        try
        {
           await Tour.create(data);
           console.log("Tour Created Successfully")
        }
        catch(err)
        {
          console.log("Error",err);
        }
      }

      async function deleteDevData()
      {
        try
        {
           await Tour.deleteMany();
           console.log("Tours Deleted Successfully")
        }
        catch(err)
        {
          console.log("Error",err);
        }
      }
     if(process.argv[2]=='--import')
     {
      importDevData()
     }
    else
     {
      deleteDevData()
    }