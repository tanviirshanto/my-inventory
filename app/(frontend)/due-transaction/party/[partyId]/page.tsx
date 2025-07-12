"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import toast from "react-hot-toast";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const PAGE_SIZE = 10;

export default function PartyDueDetailsPage() {
  const { partyId } = useParams();
  const [transactions, setTransactions] = useState([]);
  const [partyName, setPartyName] = useState("");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [totals, setTotals] = useState({
    due: 0,
    paid: 0,
    balance: 0,
  });

  const fetchTransactions = async ({ reset = false } = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: reset ? "1" : page.toString(),
        pageSize: PAGE_SIZE.toString(),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      });

      const res = await fetch(`/api/due-transaction/party/${partyId}?${params}`);
      const data = await res.json();

      if (reset) {
        setTransactions(data.transactions);
        setPage(1);
      } else {
        setTransactions((prev) => [...prev, ...data.transactions]);
      }

      setPartyName(data.name);
      setHasMore(data.transactions.length === PAGE_SIZE);

      // calculate totals
      const allTxns = reset ? data.transactions : [...transactions, ...data.transactions];

      const due = allTxns
        .filter((t) => t.type === "due")
        .reduce((sum, t) => sum + t.amount, 0);

      const paid = allTxns
        .filter((t) => t.type === "payment")
        .reduce((sum, t) => sum + t.amount, 0);

      setTotals({
        due,
        paid,
        balance: due - paid,
      });
    } catch {
      toast.error("Failed to load transactions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (partyId) fetchTransactions({ reset: true });
  }, [partyId, startDate, endDate]);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
  };

  useEffect(() => {
    if (page > 1) fetchTransactions();
  }, [page]);

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            {partyName} – Transactions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex items-center gap-4">
            <div className="flex flex-col">
              <label className="text-sm text-muted-foreground">From</label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-sm text-muted-foreground">To</label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setPage(1);
                }}
              />
            </div>
          </div>

          {/* Summary */}
          <div className="flex justify-between gap-4 text-sm font-medium">
            <p className="text-red-600">Due: {totals.due} ৳</p>
            <p className="text-green-600">Paid: {totals.paid} ৳</p>
            <p className="text-blue-600">Balance: {totals.balance} ৳</p>
          </div>

          {/* Transactions */}
          {transactions.length === 0 && !loading ? (
            <p className="text-muted-foreground">No transactions found.</p>
          ) : (
            <div className="space-y-4">
              {transactions.map((item) => (
                <Card key={item._id} className="p-4">
                  <div className="flex justify-between">
                    <div>
                      <Badge
                        variant={item.type === "due" ? "destructive" : "success"}
                      >
                        {item.type === "due" ? "Due" : "Payment"}
                      </Badge>
                      <span className="ml-2 font-semibold">
                        {item.amount.toLocaleString()} ৳
                      </span>
                      {item.note && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {item.note}
                        </p>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {format(new Date(item.date), "dd MMM yyyy")}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Loading Skeleton */}
          {loading && (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-md" />
              ))}
            </div>
          )}

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-4">
              <Button onClick={handleLoadMore}>Load More</Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
