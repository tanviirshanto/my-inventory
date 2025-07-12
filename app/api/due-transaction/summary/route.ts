import { NextResponse } from "next/server";
import { DueTransaction } from "@/models/dueTransactionModel";
import { Party } from "@/models/partyModel";
import { connectDB } from "@/connectDB/connectDB";

export async function GET() {
  try {
    await connectDB();

    const parties = await Party.find();
    const transactions = await DueTransaction.find();

    const summary = parties.map((party) => {
      const partyTxns = transactions.filter(
        (txn) => txn.party.toString() === party._id.toString()
      );

      const totalDue = partyTxns
        .filter((t) => t.type === "due")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalPayment = partyTxns
        .filter((t) => t.type === "payment")
        .reduce((sum, t) => sum + t.amount, 0);

      const totalBalance = totalDue - totalPayment;

      const latestDate = partyTxns.length
        ? new Date(
            Math.max(...partyTxns.map((t) => new Date(t.date).getTime()))
          )
        : null;

      return {
        partyId: party._id,
        name: party.name,
        totalDue,
        totalPayment,
        totalBalance,
        lastTransactionDate: latestDate,
      };
    });

    return NextResponse.json(summary);
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Failed to fetch summary" },
      { status: 500 }
    );
  }
}
