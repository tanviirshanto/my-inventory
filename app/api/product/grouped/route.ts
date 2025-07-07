// app/api/product/grouped/route.ts

import { connectDB } from "@/connectDB/connectDB";
import Product from "@/models/productModel";
import { Stock } from "@/models/stockModel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();

    // Fetch all products with party populated
    const products = await Product.find().populate("party", "name").lean();

    // Group by thickness + party._id
    const groupsMap = new Map<
      string,
      {
        thickness: string;
        party: { _id: string; name: string };
        buyingPrice: number;
        products: string[]; // array of product _ids
      }
    >();

    for (const p of products) {
      const key = p.thickness + "-" + p.party._id;
      if (!groupsMap.has(key)) {
        groupsMap.set(key, {
          thickness: p.thickness,
          party: p.party,
          buyingPrice: p.buyingPrice,
          products: [p._id.toString()],
        });
      } else {
        // Just push product _id, keep first buyingPrice (could customize later)
        groupsMap.get(key)!.products.push(p._id.toString());
      }
    }

    return NextResponse.json(Array.from(groupsMap.values()));
  } catch (err) {
    console.error("Failed to fetch grouped products", err);
    return new NextResponse("Server error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectDB();

    const { thickness, party, buyingPrice, heights, colors } = await req.json();

    // Validate inputs
    if (
      !thickness ||
      !party ||
      !buyingPrice ||
      !Array.isArray(heights) ||
      !Array.isArray(colors) ||
      heights.length === 0 ||
      colors.length === 0
    ) {
      return new NextResponse("Invalid input", { status: 400 });
    }

    const createdProducts = [];

    for (const height of heights) {
      for (const color of colors) {
        // Check if product already exists for this combo
        const exists = await Product.findOne({
          thickness,
          height,
          color,
          party,
        });
        if (!exists) {
          const product = await Product.create({
            thickness,
            height,
            color,
            buyingPrice,
            party,
          });
          createdProducts.push(product);

          try {
            await Stock.create({ product: product._id });
          } catch (err) {
            if ((err as any).code !== 11000) {
              console.error("Failed to create stock:", err);
            }
          }
        }
      }
    }

    return NextResponse.json({
      message: `Created ${createdProducts.length} product(s)`,
      products: createdProducts,
    });
  } catch (err) {
    console.error("Failed to create grouped products", err);
    return new NextResponse("Server error", { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    await connectDB();

    const { ids, buyingPrice } = await req.json();
    if (!Array.isArray(ids) || typeof buyingPrice !== "number") {
      return new NextResponse("Invalid input", { status: 400 });
    }

    // Update all products with ids in array
    await Product.updateMany({ _id: { $in: ids } }, { $set: { buyingPrice } });

    return NextResponse.json({ message: "Updated successfully" });
  } catch (err) {
    console.error("Failed to update grouped products", err);
    return new NextResponse("Server error", { status: 500 });
  }
}

// DELETE
export async function DELETE(req: NextRequest) {
  try {
    const { ids } = await req.json();

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { message: "No product IDs provided" },
        { status: 400 }
      );
    }

    await Product.deleteMany({ _id: { $in: ids } });

    return NextResponse.json({ message: "Products deleted successfully" });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: (err as Error).message },
      { status: 500 }
    );
  }
}
