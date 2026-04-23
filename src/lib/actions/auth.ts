"use server";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { cookies } from "next/headers";

export async function login(email: string) {
  try {
    await dbConnect();
    // Simplified login for demo: find or create user
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        email,
        password: 'password123', // Demo password
        name: email.split('@')[0],
        role: 'RESIDENT'
      });
    }
    
    const cookieStore = await cookies();
    cookieStore.set("user_id", user._id.toString());
    cookieStore.set("user_role", user.role);
    
    return { success: true };
  } catch (error) {
    console.error("Login failed:", error);
    return { success: false };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete("user_id");
  cookieStore.delete("user_role");
}
