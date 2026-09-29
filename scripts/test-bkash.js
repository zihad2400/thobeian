require("dotenv").config({ path: ".env.local" });
const axios = require("axios");

async function testBkash() {
  console.log("═══════════════════════════════════════");
  console.log("🔍 BKASH CREDENTIAL CHECK");
  console.log("═══════════════════════════════════════");
  console.log("");
  console.log("App Key:    ", process.env.BKASH_APP_KEY?.slice(0, 20) + "...");
  console.log("App Secret: ", process.env.BKASH_APP_SECRET?.slice(0, 20) + "...");
  console.log("Username:   ", process.env.BKASH_USERNAME);
  console.log("Password:   ", process.env.BKASH_PASSWORD?.slice(0, 5) + "...");
  console.log("Base URL:   ", process.env.BKASH_BASE_URL);
  console.log("Sandbox:    ", process.env.BKASH_IS_SANDBOX);
  console.log("");

  // Validate
  if (!process.env.BKASH_APP_KEY || process.env.BKASH_APP_KEY === "YOUR_APP_KEY_HERE") {
    console.log("❌ BKASH_APP_KEY is placeholder or missing!");
    process.exit(1);
  }

  console.log("═══════════════════════════════════════");
  console.log("🔄 Testing Token Grant...");
  console.log("═══════════════════════════════════════");
  console.log("");

  try {
    const response = await axios.post(
      `${process.env.BKASH_BASE_URL}/tokenized/checkout/token/grant`,
      {
        app_key: process.env.BKASH_APP_KEY,
        app_secret: process.env.BKASH_APP_SECRET,
      },
      {
        headers: {
          "Content-Type": "application/json",
          username: process.env.BKASH_USERNAME,
          password: process.env.BKASH_PASSWORD,
        },
      }
    );

    console.log("✅ TOKEN GRANT SUCCESS");
    console.log("");
    console.log("Response:");
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.log("❌ TOKEN GRANT FAILED");
    console.log("");
    console.log("Status:", error.response?.status);
    console.log("Data:", JSON.stringify(error.response?.data, null, 2));
    console.log("Message:", error.message);
  }

  process.exit(0);
}

testBkash();
