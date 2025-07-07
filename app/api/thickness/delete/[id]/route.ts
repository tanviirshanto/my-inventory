import { connectDB } from "@/connectDB/connectDB";
import Thickness from "@/models/thicknessModel";
import { NextResponse } from "next/server";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Thickness.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Thickness deleted.' });
  } catch (err:unknown) {
    return NextResponse.json({ error: 'Failed to delete thickness.'+ err }, { status: 500 });
  }
}