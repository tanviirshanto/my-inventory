import { connectDB } from "@/connectDB/connectDB";
import { DueTransaction } from "@/models/dueTransactionModel";
import { NextResponse } from "next/server";

// Update a specific due transaction
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const id = params.id;
    const body = await req.json();
    const { party, amount, date, type, note } = body;

    if (!party || !amount || !date || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedTxn = await DueTransaction.findByIdAndUpdate(
      id,
      { party, amount, date, type, note },
      { new: true }
    );

    if (!updatedTxn) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(updatedTxn);
  } catch (err) {
    console.error("PUT /api/due-transaction/[id] error:", err);
    return NextResponse.json({ error: "Failed to update transaction" }, { status: 500 });
  }
}
