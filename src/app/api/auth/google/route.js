import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;

    // Keep this EXACTLY identical to Google Cloud Console.
    const redirectUri =
      "http://localhost:3000/api/auth/google/callback";

    if (!clientId) {
      return NextResponse.json(
        {
          success: false,
          message: "Google OAuth is not configured",
        },
        { status: 500 }
      );
    }

    const state = crypto.randomBytes(32).toString("hex");

    const cookieStore = await cookies();

    cookieStore.set("google_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 10 * 60,
    });

    const googleParams = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: "code",
      scope: "openid email profile",
      state,
      prompt: "select_account",
    });

    const googleUrl =
      `https://accounts.google.com/o/oauth2/v2/auth?${googleParams.toString()}`;

    const response = NextResponse.redirect(googleUrl);

    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    response.headers.set("Pragma", "no-cache");
    response.headers.set("Expires", "0");

    return response;
  } catch (error) {
    console.error("Google OAuth start error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to start Google sign-in",
      },
      { status: 500 }
    );
  }
}
