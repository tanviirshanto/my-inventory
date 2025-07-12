"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { format } from "date-fns";

export default function DueSummaryPage() {
  const [summary, setSummary] = useState<any[]>([]);
  const [filteredSummary, setFilteredSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const res = await fetch("/api/due-transaction/summary");
        const data = await res.json();

        // Sort by total due descending
        data.sort((a: any, b: any) => b.totalDue - a.totalDue);

        setSummary(data);
        setFilteredSummary(data);
      } catch {
        toast.error("Failed to load due summary");
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, []);

  useEffect(() => {
    const filtered = summary.filter((party) => {
      const matchesSearch = party.name
        .toLowerCase()
        .includes(search.toLowerCase());

      const date = new Date(party.lastTransactionDate || party.createdAt || 0);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;

      const withinRange =
        (!from || date >= from) && (!to || date <= to);

      return matchesSearch && withinRange;
    });

    setFilteredSummary(filtered);
  }, [search, fromDate, toDate, summary]);

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">🧾 Party Due Summary</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
        <Input
          type="text"
          placeholder="Search by party name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full sm:w-64"
        />
        <div className="flex items-center gap-2">
          <Label htmlFor="fromDate">From:</Label>
          <Input
            type="date"
            id="fromDate"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="toDate">To:</Label>
          <Input
            type="date"
            id="toDate"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, idx) => (
            <Skeleton key={idx} className="h-24 w-full rounded-md" />
          ))}
        </div>
      ) : filteredSummary.length === 0 ? (
        <p className="text-muted-foreground text-sm text-center">No results found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {filteredSummary.map((party) => (
            <Link key={party.partyId} href={`/due-transaction/party/${party.partyId}`}>
              <Card className="hover:shadow-md transition">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {party.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex justify-between flex-wrap gap-2 text-sm">
                  <Badge variant="destructive">Due: {party.totalDue} ৳</Badge>
                  <Badge className="bg-green-600 hover:bg-green-700">
                    Paid: {party.totalPayment} ৳
                  </Badge>
                  <Badge className="bg-blue-600 hover:bg-blue-700">
                    Balance: {party.totalBalance} ৳
                  </Badge>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
