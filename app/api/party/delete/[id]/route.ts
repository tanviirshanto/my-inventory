import { connectDB } from "@/connectDB/connectDB";import { Party } from '@/models/partyModel';
import { NextResponse } from "next/server";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const deleted = await Party.findByIdAndDelete(params.id);
    if (!deleted) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Party deleted successfully' });
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Failed to delete party'+err }, { status: 500 });
  }
}
