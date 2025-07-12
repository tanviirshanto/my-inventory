import { connectDB } from "@/connectDB/connectDB";
import { StockEntry } from "@/models/stockEntryModel";
import { NextRequest, NextResponse } from "next/server";

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

// GET: Fetch all stock entries with optional date filters
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const fromDate = searchParams.get("fromDate");
    const toDate = searchParams.get("toDate");

    const query: any = {};
    if (fromDate || toDate) {
      query.date = {};
      if (fromDate) query.date.$gte = new Date(fromDate);
      if (toDate) query.date.$lte = new Date(toDate);
    }

    const entries = await StockEntry.find(query)
      .populate("product")
      .populate("party")
      .sort({ date: -1 });

    return NextResponse.json(entries);
  } catch (err: unknown) {
    return NextResponse.json({ message: getErrorMessage(err) }, { status: 500 });
  }
}
