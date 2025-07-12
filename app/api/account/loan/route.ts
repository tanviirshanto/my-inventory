// /api/account/loan/route.ts
import { connectDB } from "@/connectDB/connectDB";
import { Account } from "@/models/accountModel";
import { applyDailyInterest } from "@/utils/calculateInterest";

export async function POST(req: Request) {
  const { amount } = await req.json();
  if (!amount || amount <= 0) return new Response("Invalid amount", { status: 400 });

  await connectDB();
  const account = await Account.findOne() || await Account.create({});

  await applyDailyInterest(account); // ensure interest applied before mutation

  account.loan += amount;
  account.transactions.push({ type: "LOAN", amount });
  await account.save();

  return Response.json({ message: "Loan added", account });
}
