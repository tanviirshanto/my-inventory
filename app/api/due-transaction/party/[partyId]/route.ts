import { NextRequest, NextResponse } from "next/server";
import { DueTransaction } from "@/models/dueTransactionModel";
import { Party } from "@/models/partyModel";
import { connectDB } from "@/connectDB/connectDB";

export async function GET(
  req: NextRequest,
  { params }: { params: { partyId: string } }
) {
  try {
    await connectDB();
    const partyId = params.partyId;
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");

    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");

    const party = await Party.findById(partyId);
    if (!party) {
      return NextResponse.json({ error: "Party not found" }, { status: 404 });
    }

    const filter: any = { party: partyId };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const transactions = await DueTransaction.find(filter)
      .sort({ date: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    return NextResponse.json({
      name: party.name,
      transactions,
    });
  } catch (err) {
    console.error("API Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  }
}
