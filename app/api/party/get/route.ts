import { NextResponse } from "next/server";
import { connectDB } from "@/connectDB/connectDB";
import { Party } from "@/models/partyModel";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);

    const type = searchParams.get("type");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "5", 10);
    const search = searchParams.get("search") || "";

    const query: any = {};
    if (type && type !== "ALL") query.type = type;
    if (search) query.name = { $regex: search, $options: "i" };

    const total = await Party.countDocuments(query);
    const data = await Party.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      data,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Failed to fetch parties" + err }, { status: 500 });
  }
}
