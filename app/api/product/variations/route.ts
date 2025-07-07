import { connectDB } from "@/connectDB/connectDB";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Use aggregation to group by thickness and party
    const variations = await Product.aggregate([
      {
        $group: {
          _id: {
            thickness: "$thickness",
            party: "$party",
          },
        },
      },
      {
        $lookup: {
          from: "parties", // collection name must be lowercase plural (check actual name)
          localField: "_id.party",
          foreignField: "_id",
          as: "partyDetails",
        },
      },
      {
        $unwind: "$partyDetails",
      },
      {
        $project: {
          _id: 0,
          thickness: "$_id.thickness",
          party: {
            _id: "$partyDetails._id",
            name: "$partyDetails.name",
          },
        },
      },
      {
        $sort: { thickness: 1, "party.name": 1 },
      },
    ]);

    return NextResponse.json(variations);
  } catch (err) {
    console.error("Fetch error:", err);
    return new NextResponse("Server error", { status: 500 });
  }
}
