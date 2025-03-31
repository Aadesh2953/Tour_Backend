import { Tour } from "../models/TourModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import ApiError from "../utils/ApiError.js";
import Stripe from "stripe";
import { Bookings } from "../models/BookingModel.js";
import { User } from "../models/UserModel.js";
import ApiFeature from "../utils/FilteredQuery.js";
import { response } from "express";
export const getBooking = asyncHandler(async (req, res, next) => {
  const tour = await Tour.findById(req.params.id);
  if (!tour) {
    return next(new ApiError(404, "Tour Not Found!!!"));
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `http://localhost:5173/my-bookings`,
    cancel_url: `${req.protocol}://${req.get("host")}/tour/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.id,
    line_items: [
      {
        // selectedDate: req.body.selectedDate,
        price_data: {
          currency: "usd",
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [tour.imageCover],
          },
          unit_amount: tour.price * 100,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    metadata: {
      selectedDate: new Date(req.body.selectedDate).toISOString(),
      persons:req.body.persons
    }, // Required field for checkout session
  });

  res.status(200).send({
    success: true,
    data: session,
  });
});
export const createBooking = async (session) => {
  try {
    const tour = session.client_reference_id;
    const user = await User.findOne({ email: session.customer_email });
    const price = session.amount_total;

    let response;
    let selectedDate = new Date(session.metadata.selectedDate);

    response = await Bookings.create({
      tour,
      user,
      price,
      selectedDate,
      paymentId: session.payment_intent,
      persons:session.metadata.persons
    });
    return response;
  } catch (err) {
      console.log("err", err);
    return err;
  }
};

export const webHookController = asyncHandler(async (req, res, next) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let stripeSignature = req.headers["stripe-signature"];
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      stripeSignature,
      process.env.STRIPE_SIGNING_SECRET
    );
  } catch (error) {
    res.status(500).send(`${error}`);
  }
  const session = event.data.object;
  // const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
  //   expand: ["line_items"],
  // })
  // ;
  let response;
  if (event.type === "checkout.session.completed") {
    response = await createBooking(session);
    // res.status(200).send({data:event.data.object});
  }
  // res.status(400).send('')
  res.status(200).json({
    success: true,
    message: "Webhook processed",
    data: event.data.object,
  });
});

export const getAllBookings = asyncHandler(async (req, res, next) => {
  const features = new ApiFeature(
    Bookings.find({ user: req.user.id }),
    req.query
  )
    .filter()
    .sort()
    .limitFeilds()
    .paginate();
  const items = await Bookings.countDocuments({ user: req.user.id });
  // const options=req.query.status?'':{path:'tours',select:'name'}
  const bookings = await features.query.populate("tour");
  let hasNext =
    items <= req.query?.limit * 1 * req.query.page * 1 ? false : true;
  if (bookings.length == 0) {
    res.status(200).send({
      success: true,
      items,
      message: "No Bookings found !",
      data: bookings,
      hasNext: false,
    });
    return;
  }
  res.status(200).send({
    success: true,
    items,
    data: bookings,
    hasNext: hasNext,
  });
});
export const cancelBooking = asyncHandler(async (req, res, next) => {
  if (!req.params.id)
    next(new ApiError(400, "Booking with Given Id is Not Found!!"));
  const canceledBooking = await Bookings.findByIdAndUpdate(req.params.id, {
    $set: { status: "Cancelled" },
  });
  if (!canceledBooking)
    next(new ApiError(400, "Booking Cancelation Request Failed "));
  res.status(200).send({
    success: true,
    message: "Booking Canceled Successfully",
    data: canceledBooking,
  });
});
export const getBookingDetails = asyncHandler(async (req, res, next) => {
  let bookingDetails = await Bookings.findById(req.params.id)
    .populate("tour")
    .populate({
      path: "user",
      select: "name email",
    });
  if (!bookingDetails) {
    return next(new ApiError(404, "Booking Not Found!!"));
  }
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  const paymentMethod = await stripe.paymentIntents.retrieve(
    bookingDetails.paymentId,
    {
      expand: ["payment_method"], // Expands and includes full Payment Method details
    }
  );
  res.status(200).send({
    success: true,
    bookingDetails,
    paymentMethod,
  });
});
export const getAnalytics = asyncHandler(async (req, res, next) => {
  const analytics = Bookings.aggregate([
    {
      $lookup: {
        from: "tours",
        localField: "tour",
        foreignField: "_id",
        as: "tour",
      },
    },
    { $unwind: "$tour" },
    {
      $group: {
        _id: "$tour._id",
        total: { $sum: 1 },
        tourName: { $first: "$tour.name" },
        location: { $first: "$tour.startLocation.description" },
        earnings: { $sum: "$tour.price" },
      },
    },
    {
      $sort: { total: -1 },
    },
    {
      $group: {
        _id: null,
        totalBookings: { $sum: "$total" },
        totalEarnings: { $sum: "$earnings" },
        tour: { $push: "$$ROOT" },
      },
    },

    {
      $project: {
        _id: 0, // Exclude _id
        totalEarnings: 1,
        tour: 1,
        totalBookings: 1,
      },
    },
  ]);
  const userTotal = User.countDocuments();
  const bookingsByMonth = Bookings.aggregate([
    {
      $lookup: {
        from: "tours",
        foreignField: "_id",
        localField: "tour",
        as: "tour",
      },
    },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalBookings: { $sum: 1 },
      },
    },
  ]);
  const revenuePerMonth = Bookings.aggregate([
    {
      $lookup: {
        from: "tours",
        foreignField: "_id",
        localField: "tour",
        as: "tour",
      },
    },
    { $unwind: "$tour" },
    {
      $group: {
        _id: { $month: "$createdAt" },
        totalPrice: { $sum: "$tour.price" },
      },
    },
    {
      $sort: { _id: 1 },
    },
  ]);
  try {
    let [analyticsData, userData, bookingsData, revenueData] =
      await Promise.all([
        analytics,
        userTotal,
        bookingsByMonth,
        revenuePerMonth,
      ]);
      res.status(200).send({
        success: true,
        analyticsData,
        userData,
        bookingsData,
        revenueData,
      });
  } catch (err) {
    next(new ApiError(500, "Error Fetching Data"));
  }
  
});
