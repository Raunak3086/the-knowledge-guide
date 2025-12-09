import mongoose from "mongoose";

export const connectMongo = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.error("❌ MONGO_URI missing in .env");
      return;
    }

    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "doc_sage"
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
  }
};
