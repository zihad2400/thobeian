import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { verifyToken, COOKIE_NAME } from "./jwt";
import connectDB from "./mongodb";
import User from "@/models/User";

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function comparePassword(password, hash) {
  return bcrypt.compare(password, hash);
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    const decoded = verifyToken(token);
    if (!decoded || !decoded.userId) return null;

    await connectDB();
    const user = await User.findById(decoded.userId).select("-passwordHash");

    if (!user || !user.isActive) return null;

    return user;
  } catch (error) {
    console.error("getCurrentUser error:", error);
    return null;
  }
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireRole(roles = []) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Unauthorized");
  if (roles.length && !roles.includes(user.role)) {
    throw new Error("Forbidden");
  }
  return user;
}