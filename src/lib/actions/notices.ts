"use server";

import dbConnect from "@/lib/mongodb";
import Notice from "@/models/Notice";

export async function getNotices() {
  try {
    await dbConnect();
    const notices = await Notice.find({}).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(notices)); // MongoDB objects need serialization
  } catch (error) {
    console.error("Failed to fetch notices:", error);
    return [];
  }
}
