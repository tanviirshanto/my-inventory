import { connectDB } from "@/connectDB/connectDB";
import { Account } from "@/models/accountModel";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();
  const { amount, type } = await req.json();
  const transactionId = params.id;

  const account = await Account.findOne();
  if (!account) return NextResponse.json({ message: "Account not found" }, { status: 404 });

  const transaction = account.transactions.id(transactionId);
  if (!transaction) return NextResponse.json({ message: "Transaction not found" }, { status: 404 });

  // Rollback previous amount
  if (transaction.type === "DEPOSIT") account.balance -= transaction.amount;
  if (transaction.type === "LOAN") account.loan -= transaction.amount;
  if (transaction.type === "INTEREST") account.interest -= transaction.amount;

  // Update transaction
  transaction.amount = amount;
  transaction.type = type;

  // Reapply new values
  if (type === "DEPOSIT") account.balance += amount;
  if (type === "LOAN") account.loan += amount;
  if (type === "INTEREST") account.interest += amount;

  await account.save();

  return NextResponse.json({ message: "Transaction updated successfully" });
}


export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  await connectDB();

  const transactionId = params.id;
  const account = await Account.findOne();

  if (!account) return NextResponse.json({ message: "Account not found" }, { status: 404 });

  const transaction = account.transactions.id(transactionId);
  if (!transaction) return NextResponse.json({ message: "Transaction not found" }, { status: 404 });

  // Rollback amount from account
  const amt = transaction.amount;
  if (transaction.type === "DEPOSIT") account.balance -= amt;
  if (transaction.type === "LOAN") account.loan -= amt;
  if (transaction.type === "INTEREST") account.interest -= amt;

  // Remove transaction
  transaction.deleteOne();

  await account.save();

  return NextResponse.json({ message: "Transaction deleted successfully" });
}
