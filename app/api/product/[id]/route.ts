import { NextRequest, NextResponse } from "next/server";
import Product from "@/models/productModel";
import { connectDB } from "@/connectDB/connectDB";

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const productId = params.id;
    const body = await req.json();

    const updatedProduct = await Product.findByIdAndUpdate(productId, body, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(updatedProduct);
  } catch (error: unknown) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Error updating product", error }, { status: 500 });
  }
}
