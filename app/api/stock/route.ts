// app/api/stock/route.ts

import { NextResponse } from 'next/server';
import { connectDB } from '@/connectDB/connectDB';
import { Stock } from '@/models/stockModel';

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get('page') ?? '1');
    const limit = Number(searchParams.get('limit') ?? '10');
    const q = (searchParams.get('q') ?? '').trim();
    const skip = (page - 1) * limit;
    
    const filter: any = {};
    if (q) filter['productDetails'] = { $regex: q, $options: 'i' };
    
    const total = await Stock.countDocuments(filter);
    const items = await Stock.find(filter)
      .populate('product', 'thickness height color')
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });
    
    return NextResponse.json({ items, total, page, limit });
  } catch (err) {
    return NextResponse.json({ message: 'Error fetching stocks' }, { status: 500 });
  }
}


// ✅ POST: Add a stock manually
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { productId, quantity = 0, initialQuantity = 0 } = await req.json();

    if (!productId) {
      return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
    }

    const exists = await Stock.findOne({ product: productId });
    if (exists) {
      return NextResponse.json({ message: 'Stock already exists for this product' }, { status: 409 });
    }

    const stock = await Stock.create({
      product: productId,
      quantity,
      intialQuantity: initialQuantity,
    });

    return NextResponse.json(stock);
  } catch (error) {
    return NextResponse.json({ message: 'Failed to add stock' }, { status: 500 });
  }
}

// ✅ PATCH: Edit stock quantity
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
    const { stockId, quantity, initialQuantity } = await req.json();

    if (!stockId || typeof quantity !== "number" || typeof initialQuantity !== "number") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const updated = await Stock.findByIdAndUpdate(
      stockId,
      { quantity, intialQuantity: initialQuantity, lastUpdated: new Date() },
      { new: true }
    );

    if (!updated) return NextResponse.json({ message: "Stock not found" }, { status: 404 });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Failed to update stock" }, { status: 500 });
  }
}


// ✅ DELETE: Delete a stock by ID
export async function DELETE(req: NextRequest) {
  try {
    await connectDB();
    const { stockId } = await req.json();

    if (!stockId) return NextResponse.json({ message: 'Stock ID required' }, { status: 400 });

    const deleted = await Stock.findByIdAndDelete(stockId);
    if (!deleted) return NextResponse.json({ message: 'Stock not found' }, { status: 404 });

    return NextResponse.json({ message: 'Stock deleted' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete stock' }, { status: 500 });
  }
}

// ✅ PUT: Reset all stock quantities to 0
export async function PUT() {
  try {
    await connectDB();
    await Stock.updateMany({}, { $set: {initialQuantity:0,quantity: 0 } });
    return NextResponse.json({ message: 'All stock quantities reset to 0' });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to reset stock' }, { status: 500 });
  }
}
