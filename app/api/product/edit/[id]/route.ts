// app/api/product/edit/[id]/route.ts
import { connectDB } from "@/connectDB/connectDB";
import Product from "@/models/productModel";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { thickness, height, color,buyingPrice, party } = await req.json();

    if (!thickness || !height || !color || !buyingPrice || !party) {
      return new Response("All fields are required", { status: 400 });
    }

    const updated = await Product.findByIdAndUpdate(
      params.id,
      { thickness, height, color, buyingPrice, party },
      { new: true }
    );

    if (!updated) return new Response("Product not found", { status: 404 });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error("Failed to edit product:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
