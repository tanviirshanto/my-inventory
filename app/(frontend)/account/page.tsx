"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Pencil, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type Transaction = {
  type: "LOAN" | "DEPOSIT" | "INTEREST";
  amount: number;
  date: string;
};

type Account = {
  balance: number;
  loan: number;
  interest: number;
  interestRate: number;
  lastInterestDate: string;
  transactions: Transaction[];
};

export default function AccountPage() {
  const [account, setAccount] = useState<Account | null>(null);
  const [depositAmount, setDepositAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/account/get");
      const data = await res.json();
      setAccount(data);
    } catch (err) {
      toast.error("Failed to fetch account data");
    }
  };

  const post = async (path: string, amount: string) => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      toast.warning("Enter a valid positive number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/account/${path}`, {
        method: "POST",
        body: JSON.stringify({ amount: amt }),
      });
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Transaction successful");
      } else {
        toast.error(result.message || "Something went wrong");
      }

      setDepositAmount("");
      setLoanAmount("");
      await load();
    } catch {
      toast.error("Server error.");
    } finally {
      setLoading(false);
    }
  };

  const calcInterest = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/account/calculate-interest`, {
        method: "POST",
      });
      const result = await res.json();

      if (res.ok) {
        toast.success(result.message || "Interest applied");
      } else {
        toast.error(result.message || "No interest to apply");
      }

      await load();
    } catch {
      toast.error("Failed to apply interest");
    } finally {
      setLoading(false);
    }
  };

  const deleteTransaction = async (id: string) => {
    const res = await fetch(`/api/account/transaction/${id}`, {
      method: "DELETE",
    });
    const result = await res.json();
    toast.success(result.message);
    await load();
  };

  const editTransaction = async (t: Transaction) => {
    const newAmount = prompt("New amount", t.amount.toString());
    if (!newAmount) return;

    const amt = parseFloat(newAmount);
    if (isNaN(amt) || amt <= 0) {
      toast.warning("Enter a valid number");
      return;
    }

    const res = await fetch(`/api/account/transaction/${t._id}`, {
      method: "PUT",
      body: JSON.stringify({ amount: amt, type: t.type }),
    });

    const result = await res.json();
    toast.success(result.message);
    await load();
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4 grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">💼 Bank Account Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Button
            variant="outline"
            onClick={async () => {
              if (confirm("Are you sure you want to reset the account?")) {
                const res = await fetch("/api/account/reset", {
                  method: "POST",
                });
                const result = await res.json();
                toast.success(result.message);
                await load();
              }
            }}
          >
            Reset Account
          </Button>

          {account && (
            <>
              <p>
                💰 <strong>Balance:</strong> {account.balance.toFixed(2)}
              </p>
              <p>
                💸 <strong>Loan:</strong> {account.loan.toFixed(2)}
              </p>
              <p>
                📊 <strong>Interest:</strong> {account.interest.toFixed(2)}
              </p>
              <p>
                📅 <strong>Last Interest:</strong>{" "}
                {new Date(account.lastInterestDate).toLocaleDateString()}
              </p>
            </>
          )}

          <div className="space-y-2 pt-4">
            <Input
              type="number"
              placeholder="Loan amount"
              value={loanAmount}
              onChange={(e) => setLoanAmount(e.target.value)}
              disabled={loading}
            />
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => post("loan", loanAmount)}
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Take Loan
            </Button>

            <Input
              type="number"
              placeholder="Deposit amount"
              value={depositAmount}
              onChange={(e) => setDepositAmount(e.target.value)}
              disabled={loading}
            />
            <Button
              className="w-full"
              onClick={() => post("deposit", depositAmount)}
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Make Deposit
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={calcInterest}
              disabled={loading}
            >
              {loading && <Loader2 className="animate-spin h-4 w-4 mr-2" />}
              Calculate Interest
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>📜 Transaction History</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 max-h-[450px] overflow-y-auto pr-2 text-sm">
          {account?.transactions?.length === 0 && (
            <p className="text-muted-foreground">No transactions yet.</p>
          )}
          {account?.transactions
            ?.slice()
            .reverse()
            .map((t, i) => (
              <div
                key={i}
                className="border rounded px-3 py-2 flex justify-between items-center bg-muted/50"
              >
                <span>{t.type}</span>
                <span
                  className={
                    t.type === "LOAN"
                      ? "text-red-600"
                      : t.type === "DEPOSIT"
                      ? "text-green-600"
                      : "text-blue-600"
                  }
                >
                  {t.amount.toFixed(2)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteTransaction(t._id)}
                >
                  <Trash className="w-4 h-4 text-red-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editTransaction(t)}
                >
                  <Pencil className="w-4 h-4 text-blue-600" />
                </Button>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
