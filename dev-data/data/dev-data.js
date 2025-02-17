import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url"; // Required for __dirname equivalent
import { Tour } from "../../models/TourModel.js";
import { Reviews } from "../../models/ReviewModel.js";
import { User } from "../../models/UserModel.js";
import { connectToDb } from "../../db/index.js";

// Load environment variables
dotenv.config({ path: "./config.env" });

// Define __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Connect to DB
connectToDb().then(() => console.log("MongoDB connected!!!"));

async function importDevData() {
  try {
    const tourData = JSON.parse(fs.readFileSync(path.join(__dirname, "tours.json"), "utf-8"));
    const reviewData = JSON.parse(fs.readFileSync(path.join(__dirname, "reviews.json"), "utf-8"));
    const userData=JSON.parse(fs.readFileSync(path.join(__dirname, "users.json"), "utf-8"));
    await Tour.create(tourData);
    await Reviews.create(reviewData);
    await User.create(userData);
    console.log("Data imported successfully!");
  } catch (err) {
    console.error("Error importing data:", err);
  }
}

async function deleteDevData() {
  try {
    await Tour.deleteMany();
    await Reviews.deleteMany();
    await User.deleteMany();
    console.log("Data deleted successfully!");
  } catch (err) {
    console.error("Error deleting data:", err);
  }
}

// Check command-line arguments
if (process.argv[2] === "--import") {
  importDevData();
} else {
  deleteDevData();
}
