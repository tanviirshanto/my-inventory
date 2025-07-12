import { connectDB } from "@/connectDB/connectDB";
import { Account } from "@/models/accountModel";
import { NextResponse } from "next/server";


export async function POST() {
  await connectDB();

  const account = await Account.findOne();
  if (!account) return NextResponse.json({ message: "Account not found" }, { status: 404 });

  account.balance = 0;
  account.loan = 0;
  account.interest = 0;
  account.lastInterestDate = new Date();
  account.transactions = [];

  await account.save();

  return NextResponse.json({ message: "Account reset successfully" });
}
