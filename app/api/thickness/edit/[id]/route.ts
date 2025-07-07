import { NextResponse } from 'next/server';
import { connectDB } from '@/connectDB/connectDB';
import Thickness from '@/models/thicknessModel';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const { name } = await req.json();
    
    const updated = await Thickness.findByIdAndUpdate(params.id, { name }, { new: true });
    return NextResponse.json(updated);
  } catch (err:unknown) {
    return NextResponse.json({ error: err }, { status: 500 });
  }
}