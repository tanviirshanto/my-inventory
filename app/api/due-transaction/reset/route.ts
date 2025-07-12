import { connectDB } from "@/connectDB/connectDB";
import { DueTransaction } from "@/models/dueTransactionModel";
import { NextResponse } from "next/server";

// Reset: Delete all due transactions
export async function DELETE() {
  try {
    await connectDB();
    await DueTransaction.deleteMany({});
    return NextResponse.json({ message: "All due transactions reset" });
  } catch (err) {
    console.error("RESET /api/due-transaction/reset error:", err);
    return NextResponse.json({ error: "Failed to reset" }, { status: 500 });
  }
}
