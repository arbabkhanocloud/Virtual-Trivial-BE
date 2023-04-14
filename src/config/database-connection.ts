import mongoose from "mongoose";

export const databseConnection = async () => {
  await mongoose.connect("mongodb://localhost/Virtual-Trivial");
  console.log("Connected to the MongoDb...");
};
