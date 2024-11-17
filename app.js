import express, { json } from "express";
import { tourRouter } from "./Routes/TourRoute.js";
import { userRouter } from "./Routes/UserRoute.js";
const app = express();
app.use(express.json({ limit: "16kb" }));
app.use((req, res, next) => {
  next();
});
app.use('/api/v1/tours',tourRouter)
app.use('/api/v1/users',userRouter)
export {app}