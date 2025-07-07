
import { connectDB } from "@/connectDB/connectDB";
import Thickness from "@/models/thicknessModel";

export async function GET() {
  await connectDB();
  const all = await Thickness.find().sort({ createdAt: -1 });
  return Response.json(all);
}