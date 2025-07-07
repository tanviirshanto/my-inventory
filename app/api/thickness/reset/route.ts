import { NextResponse } from 'next/server';
import { connectDB } from '@/connectDB/connectDB';
import Thickness from '@/models/thicknessModel';

export async function DELETE() {
  try {
    await connectDB();
    await Thickness.deleteMany({});
    return NextResponse.json({ message: 'All thickness entries deleted.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete thickness entries.', error }, { status: 500 });
  }
}
