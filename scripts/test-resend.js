require("dotenv").config({ path: ".env.local" });
const { Resend } = require("resend");

async function test() {
  console.log("═══════════════════════════════════════");
  console.log("🔍 RESEND API TEST");
  console.log("═══════════════════════════════════════");
  console.log("");

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.EMAIL_FROM || "onboarding@resend.dev";
  const fromName = process.env.EMAIL_FROM_NAME || "THOBEIAN";

  console.log("API Key:", apiKey ? apiKey.substring(0, 15) + "..." : "❌ MISSING");
  console.log("From:", `${fromName} <${fromEmail}>`);
  console.log("");

  if (!apiKey || apiKey === "YOUR_RESEND_API_KEY_HERE") {
    console.log("❌ RESEND_API_KEY is placeholder or missing!");
    console.log("");
    console.log("👉 Get API key at: https://resend.com/api-keys");
    process.exit(1);
  }

  const resend = new Resend(apiKey);
  const testEmail = process.argv[2] || "delivered@resend.dev";

  console.log("═══════════════════════════════════════");
  console.log("📧 Sending test email to:", testEmail);
  console.log("═══════════════════════════════════════");
  console.log("");

  try {
    const { data, error } = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: testEmail,
      subject: "Test Email from THOBEIAN",
      html: "<h1>✅ Resend is working!</h1><p>This is a test email.</p>",
    });

    if (error) {
      console.log("❌ SEND FAILED");
      console.log("");
      console.log("Error:", JSON.stringify(error, null, 2));
      process.exit(1);
    }

    console.log("✅ SEND SUCCESS");
    console.log("");
    console.log("Response:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.log("❌ EXCEPTION");
    console.log("");
    console.log("Error:", error.message);
  }

  process.exit(0);
}

test();
