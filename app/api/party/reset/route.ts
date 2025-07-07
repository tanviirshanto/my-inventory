// app/api/party/reset/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/connectDB/connectDB';
import { Party } from '@/models/partyModel';

export async function DELETE() {
  try {
    await connectDB();
    await Party.deleteMany({});
    return NextResponse.json({ message: 'All parties reset successfully' });
  } catch (err:unknown) {
    return NextResponse.json({ error: 'Failed to reset parties'+err }, { status: 500 });
  }
}
