// /api/account/get/route.ts

import { connectDB } from "@/connectDB/connectDB";
import { Account } from "@/models/accountModel";
import { applyDailyInterest } from "@/utils/calculateInterest";

export const dynamic = "force-dynamic";

export async function GET() {
  await connectDB();

  let account = await Account.findOne();
  if (!account) {
    account = await Account.create({});
  }

  // ✅ Apply correct Islami logic
  await applyDailyInterest(account);
  await account.save();

  return Response.json(account);
}
