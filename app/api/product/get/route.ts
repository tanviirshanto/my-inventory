// app/api/product/route.ts
import { connectDB } from "@/connectDB/connectDB";
import Product from "@/models/productModel";
import { NextResponse } from "next/server";


// Get All Products
export async function GET() {
  try {
    await connectDB();
    const products = await Product.find()
      .sort({ createdAt: -1 })
      .populate("party", "name"); // Only populate the 'name' field of the party
    return NextResponse.json(products);
  } catch (error: unknown) {
    console.error("Failed to fetch products:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}

