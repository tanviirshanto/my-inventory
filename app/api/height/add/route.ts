
import { connectDB } from "@/connectDB/connectDB";
import Height from "@/models/heightModel";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
  await connectDB();
  const { name } = await req.json();

  if (!name) return new Response("Name required", { status: 400 });

  const existing = await Height.findOne({ name });
  if (existing) return new Response("Already exists", { status: 409 });

  const created = await Height.create({ name });
  return Response.json(created);
}