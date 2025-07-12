// /api/account/calculate-interest/route.ts
import { Account } from "@/models/accountModel";
import { connectDB } from "@/connectDB/connectDB";


export async function POST() {
  await connectDB();
  const account = await Account.findOne();
  if (!account) return new Response("Account not found", { status: 404 });

  const today = new Date();
  const days = Math.floor(
    (today.getTime() - new Date(account.lastInterestDate).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (days <= 0 || account.loan <= 0) {
    return Response.json({ message: "No interest to add", account });
  }

  const interest = account.loan * account.interestRate * days;
  account.loan += interest;
  account.lastInterestDate = today;

  account.transactions.push({ type: "INTEREST", amount: interest });

  await account.save();
  return Response.json({ message: `Interest (${days} days) added`, interest, account });
}
export const dynamic = "force-dynamic";