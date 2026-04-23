"use server";

import dbConnect from "@/lib/mongodb";
import Complaint from "@/models/Complaint";
import { revalidatePath } from "next/cache";

export async function getComplaints(userId?: string) {
  try {
    await dbConnect();
    const query = userId ? { userId } : {};
    const complaints = await Complaint.find(query).sort({ createdAt: -1 });
    return JSON.parse(JSON.stringify(complaints));
  } catch (error) {
    console.error("Failed to fetch complaints:", error);
    return [];
  }
}

export async function createComplaint(data: { title: string; description: string; userId: string; category?: string }) {
  try {
    await dbConnect();
    await Complaint.create({
      title: data.title,
      description: data.description,
      userId: data.userId,
      category: data.category || 'General',
      status: 'OPEN',
    });
    revalidatePath("/complaints");
    return { success: true };
  } catch (error) {
    console.error("Failed to create complaint:", error);
    return { success: false, error: "Database error" };
  }
}
