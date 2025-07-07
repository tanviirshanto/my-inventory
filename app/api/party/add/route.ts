
import { connectDB } from "@/connectDB/connectDB";
import { Party } from '@/models/partyModel'
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    console.log('Adding party:', body);

    const exists = await Party.findOne({ name: body.name, type: body.type });
    console.log('Party exists:', exists);
    if (exists) {
      return NextResponse.json({ error: 'Party already exists' }, { status: 400 });
    }

    const newParty = await Party.create(body);
    console.log('New party created:', newParty);
    return NextResponse.json(newParty);
  } catch (err:unknown) {
    return NextResponse.json({ error: 'Failed to add party'+err }, { status: 500 });
  }
}