import { connectDB } from "@/connectDB/connectDB";
import { DueTransaction } from "@/models/dueTransactionModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const page = parseInt(req.nextUrl.searchParams.get("page") || "1", 10);
    const limit = parseInt(req.nextUrl.searchParams.get("limit") || "2", 2);
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      DueTransaction.find()
        .populate({ path: "party", options: { strictPopulate: false } })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      DueTransaction.countDocuments(),
    ]);

    return NextResponse.json({
      data,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /api/due-transaction error:", err);
    return NextResponse.json(
      { error: "Failed to fetch", message: (err as Error).message },
      { status: 500 }
    );
  }
}


// Add a new due or payment transaction
export async function POST(req: Request) {
  try {
    await connectDB();
    const { party, amount, date, type, note } = await req.json();

    if (!party || !amount || !date || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newTxn = await DueTransaction.create({ party, amount, date, type, note });
    return NextResponse.json(newTxn);
  } catch (err) {
    console.error("POST /api/due-transaction error:", err);
    return NextResponse.json({ error: "Failed to create" }, { status: 500 });
  }
}

// Update a due transaction
export async function PUT(req: Request) {
  try {
    await connectDB();
    const { _id, party, amount, date, type, note } = await req.json();

    if (!_id || !party || !amount || !date || !type) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const updated = await DueTransaction.findByIdAndUpdate(
      _id,
      { party, amount, date, type, note },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err) {
    console.error("PUT /api/due-transaction error:", err);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await connectDB();
    const url = new URL(req.url);
    const id = url.searchParams.get("id");  // read from query param

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const deleted = await DueTransaction.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("DELETE /api/due-transaction error:", err);
    return NextResponse.json({ error: "Failed to delete" }, { status: 500 });
  }
}

