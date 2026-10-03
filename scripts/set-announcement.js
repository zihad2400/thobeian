require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function set() {
  await mongoose.connect(process.env.MONGODB_URI);
  const db = mongoose.connection.db;

  const args = process.argv.slice(2);
  const text = args[0] || "FREE SHIPPING ON ORDERS ABOVE ৳5000 • EID COLLECTION NOW LIVE";
  const link = args[1] || "/collections/eid-collection";
  const isActive = args[2] !== "off";

  await db.collection("sitesettings").updateOne(
    {},
    {
      $set: {
        announcement: {
          text,
          link,
          isActive,
          backgroundColor: "#1F1F1F",
          textColor: "#FFFFFF",
        },
        updatedAt: new Date(),
      },
    },
    { upsert: true }
  );

  console.log("✅ Announcement updated");
  console.log("   Text:  ", text);
  console.log("   Link:  ", link);
  console.log("   Active:", isActive);

  await mongoose.disconnect();
  process.exit(0);
}

set();
