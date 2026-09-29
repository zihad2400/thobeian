require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function updateStatus() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const orderNumber = process.argv[2];
    const status = process.argv[3];

    if (!orderNumber || !status) {
      console.log("❌ Usage: node scripts/update-order-status.js THB-XXX-XXXXX confirmed");
      console.log("");
      console.log("Available statuses:");
      console.log("  pending | confirmed | processing | shipped | out_for_delivery | delivered | cancelled");
      process.exit(1);
    }

    const order = await db.collection("orders").findOne({ orderNumber });
    if (!order) {
      console.log("❌ Order not found:", orderNumber);
      process.exit(1);
    }

    await db.collection("orders").updateOne(
      { orderNumber },
      {
        $set: {
          orderStatus: status,
          updatedAt: new Date(),
        },
        $push: {
          statusHistory: {
            status,
            timestamp: new Date(),
            note: `Status changed to ${status}`,
          },
        },
      }
    );

    console.log("✅ Order updated");
    console.log("   Order:", orderNumber);
    console.log("   New status:", status);

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

updateStatus();
