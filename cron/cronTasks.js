import { Tour } from "../models/TourModel.js";
import { Email } from "../utils/email.js";
import cron from "node-cron";

const BASE_URL = process.env.BASE_URL || "https://localhost:5173/";

export default function cronTasks() {
  const sendTourStartMail = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const dateRangeQuery = {
      $gte: today,
      $lt: tomorrow,
    };

    const tours = await Tour.find({ startDates: dateRangeQuery }).populate(
      "createdBy"
    );
    let tourPromises = tours.map(async (tour) => {
      const adminName = tour.createdBy.name;
      const adminMailPromises = new Email(
        adminName,
        `http://localhost:5173/me`
      ).sendTourStartMailAdmin(tour);
      const userMails = await Bookings.find({
        $and: [{ selectedDate: dateRangeQuery }, { tours: tour._id }],
      }).populate({
        path: "user",
        select: "name email",
      });
      let userMailPromises = userMails.map((userMail) => {
        return new Email({
          tourDetails: tour,
          userDetails: userMail.user,
        }).sendTourStartMailUser();
      });
      return Promise.all([adminMailPromises, ...userMailPromises]);
    });
    await Promise.all(tourPromises);
    console.log(" Tour start mails sent successfully.");
  };

  // Run daily at midnight
  cron.schedule("0 0 * * *", sendTourStartMail);
}
