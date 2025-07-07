//api/color/get/route.ts
import { connectDB } from "@/connectDB/connectDB";
import Color from "@/models/colorModel";

export async function GET() {
  await connectDB();
  const all = await Color.find().sort({ createdAt: -1 });
  return Response.json(all);
}