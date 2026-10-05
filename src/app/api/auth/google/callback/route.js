import crypto from "crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";

import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { hashPassword } from "@/lib/auth";
import { signToken, COOKIE_NAME, cookieOptions } from "@/lib/jwt";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const oauthError = searchParams.get("error");

    if (oauthError) {
      return NextResponse.redirect(
        new URL("/login?error=google_cancelled", req.url)
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        new URL("/login?error=google_invalid_request", req.url)
      );
    }

    const cookieStore = await cookies();
    const savedState =
      cookieStore.get("google_oauth_state")?.value;

    if (
      !savedState ||
      savedState.length !== state.length ||
      !crypto.timingSafeEqual(
        Buffer.from(savedState),
        Buffer.from(state)
      )
    ) {
      cookieStore.delete("google_oauth_state");

      return NextResponse.redirect(
        new URL("/login?error=google_invalid_state", req.url)
      );
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = "http://localhost:3000/api/auth/google/callback";

    if (!clientId || !clientSecret || !redirectUri) {
      console.error("Google OAuth environment variables are missing");

      cookieStore.delete("google_oauth_state");

      return NextResponse.redirect(
        new URL("/login?error=google_config", req.url)
      );
    }

    const googleClient = new OAuth2Client(
      clientId,
      clientSecret,
      redirectUri
    );

    const { tokens } = await googleClient.getToken(code);

    if (!tokens.id_token) {
      throw new Error("Google ID token was not returned");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: tokens.id_token,
      audience: clientId,
    });

    const payload = ticket.getPayload();

    if (!payload) {
      throw new Error("Invalid Google identity");
    }

    const googleId = payload.sub;
    const email = payload.email?.toLowerCase();
    const emailVerified = payload.email_verified === true;

    if (!googleId || !email || !emailVerified) {
      throw new Error("Google account email is not verified");
    }

    const name =
      payload.name ||
      payload.given_name ||
      email.split("@")[0];

    const avatar = payload.picture || "";

    await connectDB();

    let user = await User.findOne({
      googleId,
    });

    if (!user) {
      user = await User.findOne({
        email,
      });

      if (user) {
        if (!user.isActive) {
          cookieStore.delete("google_oauth_state");

          return NextResponse.redirect(
            new URL("/login?error=account_disabled", req.url)
          );
        }

        user.googleId = googleId;

        if (!user.avatar && avatar) {
          user.avatar = avatar;
        }

        user.isVerified = true;
        user.lastLogin = new Date();

        await user.save();
      }
    }

    if (!user) {
      const randomPassword = crypto
        .randomBytes(32)
        .toString("hex");

      const passwordHash = await hashPassword(
        randomPassword
      );

      user = await User.create({
        name,
        email,
        phone: "",
        passwordHash,
        googleId,
        avatar,
        role: "customer",
        isVerified: true,
        isActive: true,
        lastLogin: new Date(),
      });
    } else {
      user.lastLogin = new Date();
      await user.save();
    }

    const token = signToken({
      userId: user._id.toString(),
      role: user.role,
    });

    cookieStore.delete("google_oauth_state");

    const response = NextResponse.redirect(
      new URL("/account?google=success", req.url)
    );

    response.cookies.set(
      COOKIE_NAME,
      token,
      cookieOptions
    );

    return response;
  } catch (error) {
    console.error("Google OAuth callback error:", error);

    const response = NextResponse.redirect(
      new URL("/login?error=google_failed", req.url)
    );

    response.cookies.delete("google_oauth_state");

    return response;
  }
}
