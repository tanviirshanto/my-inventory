
import { connectDB } from "@/connectDB/connectDB";
import { Payment } from "@/models/paymentModel";
import { NextResponse } from "next/server";
import { Party } from "@/models/partyModel";



export async function GET() {
  try {
    await connectDB();
    const payments = await Payment.find()
      .populate({ path: "party", options: { strictPopulate: false } }) // safer population
      .sort({ date: -1 });

    return NextResponse.json(payments);
  } catch (err) {
    console.error("❌ GET /api/payments error:", err); // this is key!
    return NextResponse.json(
      { error: "Failed to fetch payments", message: (err as Error).message },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    await connectDB();
    const body = await req.json();
    const { amount, party, date, note, type } = body;

    if (!amount || !party || !date || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newPayment = await Payment.create({ amount, party, type, date, note });
    return NextResponse.json(newPayment);
  } catch (err) {
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
