// app/api/product/delete/[id]/route.ts
import { connectDB } from "@/connectDB/connectDB";
import Product from "@/models/productModel";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const deleted = await Product.findByIdAndDelete(params.id);

    if (!deleted) return new Response("Product not found", { status: 404 });

    return new Response("Product deleted successfully", { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to delete product:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
