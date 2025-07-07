//api/color/reset/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/connectDB/connectDB';
import Color from '@/models/colorModel';

export async function DELETE() {
  try {
    await connectDB();
    await Color.deleteMany({});
    return NextResponse.json({ message: 'All color entries deleted.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete color entries.', error }, { status: 500 });
  }
}
