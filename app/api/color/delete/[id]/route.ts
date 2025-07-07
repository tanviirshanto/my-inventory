//api/color/delete/[id]/route.ts
import { connectDB } from "@/connectDB/connectDB";
import Color from "@/models/colorModel";
import { NextResponse } from "next/server";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Color.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Color deleted.' });
  } catch (err:unknown) {
    return NextResponse.json({ error: 'Failed to delete color.'+ err }, { status: 500 });
  }
}