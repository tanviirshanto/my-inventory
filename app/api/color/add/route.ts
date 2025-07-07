//api/color/add/route.ts
import { connectDB } from "@/connectDB/connectDB";
import Color from "@/models/colorModel";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest) {
  await connectDB();
  const { name } = await req.json();

  if (!name) return new Response("Name required", { status: 400 });

  const existing = await Color.findOne({ name });
  if (existing) return new Response("Already exists", { status: 409 });

  const created = await Color.create({ name });
  return Response.json(created);
}