
import { connectDB } from "@/connectDB/connectDB";
import Height from "@/models/heightModel";

export async function GET() {
  await connectDB();
  const all = await Height.find().sort({ createdAt: -1 });
  return Response.json(all);
}