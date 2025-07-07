import { NextResponse } from "next/server";
import { connectDB } from "@/connectDB/connectDB";
import Color from "@/models/colorModel";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    await connectDB();

    const { name } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }

    const updated = await Color.findByIdAndUpdate(params.id, { name }, { new: true });
    if (!updated) {
      return NextResponse.json({ error: "Color not found." }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (err: unknown) {
    return NextResponse.json(
      { error: "Failed to update color: " + (err as Error).message },
      { status: 500 }
    );
  }
}
