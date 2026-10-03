import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || "onboarding@resend.dev";
const FROM_NAME = process.env.EMAIL_FROM_NAME || "THOBEIAN";

// ===== Send Password Reset Email =====
export async function sendPasswordResetEmail({ email, name, resetUrl }) {
  try {
    const { data, error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: "Reset Your THOBEIAN Password",
      html: getPasswordResetTemplate({ name, resetUrl }),
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error: error.message };
  }
}

// ===== Password Reset Email Template =====
function getPasswordResetTemplate({ name, resetUrl }) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reset Password</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F7F3EA; font-family: 'Inter', Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F7F3EA; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #FFFFFF; max-width: 600px; border: 1px solid #EFE8DC;">
          
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 20px; text-align: center; border-bottom: 1px solid #EFE8DC;">
              <h1 style="font-family: 'Playfair Display', Georgia, serif; font-size: 32px; letter-spacing: 3px; color: #1F1F1F; margin: 0;">
                THOBEIAN
              </h1>
              <p style="font-size: 11px; letter-spacing: 3px; color: #C8A96B; text-transform: uppercase; margin: 8px 0 0;">
                Premium Islamic Fashion
              </p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <p style="font-size: 20px; color: #1F1F1F; margin: 0 0 16px; font-family: 'Playfair Display', Georgia, serif;">
                Hi ${name || "there"},
              </p>

              <p style="font-size: 14px; line-height: 1.7; color: #6B6B6B; margin: 0 0 24px;">
                We received a request to reset the password for your THOBEIAN account.
                Click the button below to create a new password.
              </p>

              <!-- Button -->
              <table cellpadding="0" cellspacing="0" style="margin: 32px 0;">
                <tr>
                  <td align="center" style="background-color: #1F1F1F;">
                    <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; color: #FFFFFF; text-decoration: none; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; font-weight: 500;">
                      Reset My Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-size: 13px; line-height: 1.7; color: #6B6B6B; margin: 0 0 12px;">
                Or copy this link into your browser:
              </p>

              <p style="font-size: 12px; color: #C8A96B; word-break: break-all; background-color: #F7F3EA; padding: 12px; border: 1px solid #EFE8DC; margin: 0 0 24px; font-family: monospace;">
                ${resetUrl}
              </p>

              <!-- Warning -->
              <div style="border-left: 3px solid #C8A96B; padding: 12px 20px; background-color: #FAF9F6; margin: 24px 0;">
                <p style="font-size: 12px; color: #6B6B6B; margin: 0; line-height: 1.6;">
                  ⏱️ This link expires in <strong style="color: #1F1F1F;">1 hour</strong>.
                </p>
                <p style="font-size: 12px; color: #6B6B6B; margin: 8px 0 0; line-height: 1.6;">
                  🔒 If you didn't request this, you can safely ignore this email.
                </p>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding: 24px 40px; background-color: #FAF9F6; border-top: 1px solid #EFE8DC; text-align: center;">
              <p style="font-size: 11px; color: #9B9B9B; margin: 0 0 8px; letter-spacing: 1px;">
                Sunnah in Style • Elegance in Every Thread
              </p>
              <p style="font-size: 10px; color: #9B9B9B; margin: 0;">
                © ${new Date().getFullYear()} THOBEIAN. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

// ===== Test Email (Dev only) =====
export async function sendTestEmail(to) {
  const { data, error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to,
    subject: "Test Email from THOBEIAN",
    html: "<p>This is a test email. If you received it, Resend is working!</p>",
  });
  return { data, error };
}
