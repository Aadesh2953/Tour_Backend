import express, { json } from "express";
import { tourRouter } from "./Routes/TourRoute.js";
import { userRouter } from "./Routes/UserRoute.js";
import { connectToDb } from "./index.js";
import dotenv from 'dotenv'
dotenv.config({path:'./config.env'})
const app = express();
connectToDb()
app.use(express.json({ limit: "16kb" }));
app.use((req, res, next) => {
  console.log("Hello World");
  next();
});
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)
export {app}