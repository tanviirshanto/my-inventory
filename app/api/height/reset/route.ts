import { NextResponse } from 'next/server';
import { connectDB } from '@/connectDB/connectDB';
import Height from '@/models/heightModel';

export async function DELETE() {
  try {
    await connectDB();
    await Height.deleteMany({});
    return NextResponse.json({ message: 'All height entries deleted.' }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Failed to delete height entries.', error }, { status: 500 });
  }
}
