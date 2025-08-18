import express from "express";
import cors from "cors";
import ApiError from "./utils/ApiError.js";
import { apiErrorHandler } from "./controllers/ErrorController.js";
import { tourRouter } from "./Routes/TourRoute.js";
import { userRouter } from "./Routes/UserRoute.js";
import rateLimit from "express-rate-limit";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import xss from "xss-clean";
import hpp from "hpp";
import { bookingRouter } from "./Routes/BookingRoute.js";
import { webHookController } from "./controllers/BookingController.js";
import compression from "compression";
import cronTasks from "./cron/cronTasks.js";
// import { verifyToken } from "./middlewares/AuthMiddleWare.js";
const app = express();
app.use(helmet());

app.set("view engine", "pug");
app.set("views", "./views");
app.get("/", (req, res, next) => {
  res.status(200).render("base");
  // next()
});
app.post(
  "/webhook-checkout",
  express.raw({ type: "application/json" }),
  webHookController
);
app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true }));
app.use(mongoSanitize());
app.use(xss());
app.use(
  cors({
    origin: ["https://tour-frontend-dkfo.vercel.app/"], // allow your Vercel frontend
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
); // Allows requests from any origin
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too Many Requests from this IP,please try again in an hour!!",
});
app.use(hpp({ whitelist: ["RatingsAverage", "maxGroupSize"] }));
app.use(compression());
app.use("/api", limiter);
app.use("/api/v1/tours", tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/bookings", bookingRouter);
app.use(express.static("pulic/temp"));
app.all("*", (req, res, next) => {
  next(new ApiError("404", `Can't find ${req.originalUrl} on this server`));
});
app.use(apiErrorHandler);
cronTasks();
// app.use
export { app };
