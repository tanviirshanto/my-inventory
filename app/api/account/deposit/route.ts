// /api/account/deposit/route.ts
import { connectDB } from "@/connectDB/connectDB";
import { Account } from "@/models/accountModel";
import { applyDailyInterest } from "@/utils/calculateInterest";

export async function POST(req: Request) {
  const { amount } = await req.json();
  if (!amount || amount <= 0) {
    return new Response("Invalid amount", { status: 400 });
  }

  await connectDB();
  const account = await Account.findOne() || await Account.create({});

  await applyDailyInterest(account);

  let remaining = amount;

  // Pay off loan
  if (account.loan > 0) {
    const loanPayment = Math.min(remaining, account.loan);
    account.loan -= loanPayment;
    remaining -= loanPayment;
  }

  // Pay off interest if loan is cleared
  if (account.loan === 0 && account.interest > 0) {
    const interestPayment = Math.min(remaining, account.interest);
    account.interest -= interestPayment;
    remaining -= interestPayment;
  }

  // Store remaining in balance
  account.balance += remaining;

  // Track full deposit amount as transaction
  account.transactions.push({ type: "DEPOSIT", amount });

  await account.save();

  return Response.json({ message: "Deposit successful", account });
}
