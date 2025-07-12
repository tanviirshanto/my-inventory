// app/api/reports/monthly-sales/route.ts

import { connectDB } from "@/connectDB/connectDB";
import Product from "@/models/productModel";
import { StockEntry } from "@/models/stockEntryModel";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const month = parseInt(searchParams.get("month") || `${new Date().getMonth() + 1}`, 10);
    const year = parseInt(searchParams.get("year") || `${new Date().getFullYear()}`, 10);

    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 1);

    const sales = await StockEntry.aggregate([
      {
        $match: {
          type: "OUT",
          date: { $gte: start, $lt: end },
        },
      },
      {
        $group: {
          _id: "$product",
          totalSold: { $sum: "$quantity" },
          totalItemTotal: { $sum: "$itemTotal" },
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $project: {
          _id: 0,
          productId: "$product._id",
          thickness: "$product.thickness",
          height: "$product.height",
          color: "$product.color",
          totalSold: 1,
          totalItemTotal: 1,
        },
      },
    ]);

    const grandTotal = sales.reduce((acc, item) => acc + item.totalItemTotal, 0);

    return NextResponse.json({
      sales,
      grandTotal,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch monthly sales: " + (err as any).message },
      { status: 500 }
    );
  }
}
