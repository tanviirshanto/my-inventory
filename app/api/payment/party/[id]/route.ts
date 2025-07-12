import { connectDB } from "@/connectDB/connectDB";
import { Payment } from "@/models/paymentModel";
import { NextResponse } from "next/server";
import { Party } from "@/models/partyModel";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const partyId = params.id;
    console.log("Fetching payment history for party ID:", partyId);
    const payments = await Payment.find({ party: partyId })
      .sort({ date: -1 })
      .populate("party");
    console.log("Fetched payments:", payments, "records found");
    return NextResponse.json({ payments });
  } catch (err) {
    console.error("Error fetching payment history:", err);
    return new NextResponse("Failed to fetch payment history", { status: 500 });
  }
}
