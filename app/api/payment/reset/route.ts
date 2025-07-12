
import { connectDB } from "@/connectDB/connectDB";
import { Payment } from "@/models/paymentModel";
import { NextResponse } from "next/server";

export async function DELETE() {
  try {
    await connectDB();
    await Payment.deleteMany({});
    return NextResponse.json({ message: "All payments have been reset." });
  } catch (err) {
    return NextResponse.json({ error: "Failed to reset payments" }, { status: 500 });
  }
}
