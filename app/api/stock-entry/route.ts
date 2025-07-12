import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/connectDB/connectDB";
import { StockEntry } from "@/models/stockEntryModel";
import Product from "@/models/productModel";
import Party from "@/models/partyModel";
import { calculateStock } from "@/utils/calculateStock";
import { calculateItemTotal } from "@/utils/calculateItemTotal";


function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return "Unknown error";
}

// ✅ GET: Fetch all stock entries
export async function GET() {
  try {
    await connectDB();
    const entries = await StockEntry.find()
      .populate("product", "thickness height color")
      .populate("party", "name type");
    return NextResponse.json(entries);
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to fetch stock entries: " + getErrorMessage(err) },
      { status: 500 }
    );
  }
}

// ✅ POST: Create a new stock entry
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { product, quantity, party, type, date, note } = await req.json();

    console.log("Creating stock entry with data:", {
      product,
      quantity,
      party,
      type,
      date,
      note,
    });

    if (!product || quantity == null || !party || !type) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // 🔁 Fetch product details to calculate itemTotal
    const productDoc = await Product.findById(product);
    if (!productDoc)
      return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const { thickness, height, buyingPrice } = productDoc;

    const itemTotal = calculateItemTotal({
      thickness: parseInt(thickness),
      height: parseInt(height),
      price: buyingPrice,
      quantity,
    });

    const newEntry = await StockEntry.create({
      product,
      quantity,
      party,
      type,
      date: date || new Date(),
      note,
      itemTotal,
    });

    await calculateStock(product.toString());

    return NextResponse.json(newEntry);
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to add stock entry: " + getErrorMessage(err) },
      { status: 500 }
    );
  }
}


// ✅ PATCH: Update a stock entry
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { id, quantity, party, type, date, note } = await req.json();

    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    const existing = await StockEntry.findById(id);
    if (!existing)
      return NextResponse.json({ message: "Stock entry not found" }, { status: 404 });

    const productDoc = await Product.findById(existing.product);
    if (!productDoc)
      return NextResponse.json({ message: "Product not found" }, { status: 404 });

    const { thickness, height, buyingPrice } = productDoc;

    const itemTotal = calculateItemTotal({
      thickness: parseInt(thickness),
      height: parseInt(height),
      price: buyingPrice,
      quantity,
    });

    const updated = await StockEntry.findByIdAndUpdate(
      id,
      { quantity, party, type, date, note, itemTotal },
      { new: true }
    );

    await calculateStock(existing.product.toString());

    return NextResponse.json(updated);
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to update stock entry: " + getErrorMessage(err) },
      { status: 500 }
    );
  }
}


// ✅ DELETE: Delete a stock entry
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { id } = await req.json();
    if (!id) return NextResponse.json({ message: "ID is required" }, { status: 400 });

    const entry = await StockEntry.findById(id);
    if (!entry)
      return NextResponse.json({ message: "Stock entry not found" }, { status: 404 });

    await StockEntry.findByIdAndDelete(id);

    await calculateStock(entry.product.toString()); // Recalculate after deletion

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to delete stock entry: " + getErrorMessage(err) },
      { status: 500 }
    );
  }
}

// ✅ PUT: Reset (delete all) stock entries
export async function PUT() {
  try {
    await connectDB();
    await StockEntry.deleteMany({});
    // You can optionally reset all stock quantities too, if needed
    return NextResponse.json({ message: "All stock entries reset (deleted)" });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Failed to reset stock entries: " + getErrorMessage(err) },
      { status: 500 }
    );
  }
}
