// app/api/product/add/route.ts
import { connectDB } from "@/connectDB/connectDB";
import Product from "@/models/productModel";
import { Stock } from "@/models/stockModel";
import { NextRequest, NextResponse } from "next/server";

// Add Product
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { thickness, height, color,buyingPrice, party } = await req.json();

    console.log("Adding product:", { thickness, height, color, buyingPrice, party });

    if (!thickness || !height || !color || !buyingPrice|| !party) {
      return new Response("All fields are required", { status: 400 });
    }

    const exists = await Product.findOne({ thickness, height, color, party });
    if (exists) return new Response("Product already exists", { status: 409 });

    const created = await Product.create({ thickness, height, color,buyingPrice, party });

    await Stock.create({ product: created._id });

    return NextResponse.json(created);
  } catch (error: unknown) {
    console.error("Failed to add product:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
