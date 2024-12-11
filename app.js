import express from "express";
import ApiError from "./utils/ApiError.js";
import { apiErrorHandler } from "./controllers/ErrorController.js";
import { tourRouter } from "./Routes/TourRoute.js";
import { userRouter } from "./Routes/UserRoute.js";
const app = express();
app.use(express.json({ limit: "16kb" }));
// app.use(express.static(''))
app.use((req, res, next) => {
  next();
});
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.all("*", (req, res, next) => {
  next(
    new ApiError(
      "404",
      `Route does Not Exist for ${req.originalUrl} on this Server`
    )
  );
});
app.use(apiErrorHandler);
export { app };
