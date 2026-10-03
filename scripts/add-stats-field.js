require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function update() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  // Default stats if not exist
  const current = await db.collection("sitesettings").findOne({});
  if (!current?.brandStoryStats) {
    await db.collection("sitesettings").updateOne(
      {},
      {
        $set: {
          brandStoryStats: [
            { label: "Happy Customers", value: "10K+" },
            { label: "Premium Fabrics", value: "50+" },
            { label: "Handcrafted", value: "100%" },
            { label: "Customer Rating", value: "5★" },
          ],
        },
      },
      { upsert: true }
    );
    console.log("✅ Brand story stats added to settings");
  } else {
    console.log("✅ Brand story stats already exist");
  }

  await mongoose.disconnect();
  process.exit(0);
}

update();
