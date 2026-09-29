require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function approvePending() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const result = await db
      .collection("productreviews")
      .updateMany({ status: "pending" }, { $set: { status: "approved" } });

    console.log("✅ Approved:", result.modifiedCount, "pending reviews");

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

approvePending();
