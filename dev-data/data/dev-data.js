import mongoose from "mongoose";
import fs from "fs"
import dotenv from 'dotenv'
import { Tour } from "../../models/TourModel.js";
import { Reviews } from "../../models/ReviewModel.js";
import { connectToDb } from '../../db/index.js';
dotenv.config({ path: './config.env' });
// export const connectToDb = async () => {
//   try {
//     const connection = await mongoose.connect(process.env.DATABASE_URL);
//     console.log("Connection Object:", connection.connection.host);
//   } catch (error) {
//     console.error(`Database connection failed: ${error.message}`);
//     process.exit(1); // Exit the process with a failure code
//   }
// };
connectToDb().then(()=>
console.log("Mongo DB connected!!!"))
      async function importDevData()
      {
        const tourData=JSON.parse(fs.readFileSync(`./tours.json`,"utf-8"))
        const reviewData=JSON.parse(fs.readFileSync('./reviews.json','utf-8'))
        try
        {
           await Tour.create(tourData);
           await Reviews.create(reviewData);
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
           await Reviews.deleteMany();
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