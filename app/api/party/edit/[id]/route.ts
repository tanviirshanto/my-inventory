// app/api/party/[id]/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/connectDB/connectDB';
import { Party } from '@/models/partyModel';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const body = await req.json();
    const updatedParty = await Party.findByIdAndUpdate(params.id, body, { new: true });
    if (!updatedParty) {
      return NextResponse.json({ error: 'Party not found' }, { status: 404 });
    }
    return NextResponse.json(updatedParty);
  } catch (err: unknown) {
    return NextResponse.json({ error: 'Failed to update party'+err }, { status: 500 });
  }
}
