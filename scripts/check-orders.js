require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");

async function checkOrders() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;
    const orders = await db
      .collection("orders")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    console.log("📦 Total orders:", orders.length);
    console.log("═══════════════════════════════════════");

    orders.forEach((o, i) => {
      console.log(`${i + 1}. ${o.orderNumber}`);
      console.log(`   Status: ${o.orderStatus}`);
      console.log(`   Payment: ${o.paymentMethod} (${o.paymentStatus})`);
      console.log(`   Items: ${o.items?.length || 0}`);
      console.log(`   Total: ৳${o.total}`);
      console.log(`   Date: ${new Date(o.createdAt).toLocaleString()}`);
      console.log("");
    });

    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

checkOrders();
