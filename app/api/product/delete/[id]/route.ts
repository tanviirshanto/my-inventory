import { connectDB } from "@/connectDB/connectDB";
import Product from "@/models/productModel";
import { Stock } from "@/models/stockModel";

export async function DELETE(
  _: Request,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();

    const deletedProduct = await Product.findByIdAndDelete(params.id);

    if (!deletedProduct)
      return new Response("Product not found", { status: 404 });

    // Delete associated stock
    await Stock.findOneAndDelete({ product: deletedProduct._id });

    return new Response("Product and stock deleted successfully", { status: 200 });
  } catch (error: unknown) {
    console.error("Failed to delete product and stock:", error);
    return new Response("Something went wrong", { status: 500 });
  }
}
