import { connectDB } from "@/connectDB/connectDB";
import Height from "@/models/heightModel";
import { NextResponse } from "next/server";

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Height.findByIdAndDelete(params.id);
    return NextResponse.json({ message: 'Height deleted.' });
  } catch (err:unknown) {
    return NextResponse.json({ error: 'Failed to delete thickness.'+ err }, { status: 500 });
  }
}