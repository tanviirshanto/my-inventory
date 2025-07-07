// app/api/product/reset/route.ts
import { connectDB } from "@/connectDB/connectDB";
import Product from "@/models/productModel";

export async function DELETE() {
  try {
    await connectDB();
    await Product.deleteMany({});
    return new Response("All products deleted", { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to reset products:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
