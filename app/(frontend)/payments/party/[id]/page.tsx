"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Payment = {
  _id: string;
  amount: number;
  type: "IN" | "OUT";
  date: string;
  note?: string;
  party: {
    _id: string;
    name: string;
    type: "CUSTOMER" | "SUPPLIER";
  };
};

export default function PartyPaymentHistoryPage() {
  const { id: partyId } = useParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!partyId) return;
    const fetchPayments = async () => {
      try {
        const res = await fetch(`/api/payment/party/${partyId}`);
        const data = await res.json();
        setPayments(data.payments);
      } catch (err) {
        console.error("Failed to fetch payments", err);
      } finally {
        setLoading(false); 
      }
    };
    fetchPayments();
  }, [partyId]);

  if (loading) return <p>Loading payment history...</p>;

  if (payments.length === 0) return <p>No payments found for this party.</p>;

  const partyName = payments[0]?.party?.name;
  const partyType = payments[0]?.party?.type;

  return (
    <Card className="max-w-4xl mx-auto my-6">
      <CardHeader>
        <CardTitle>Payment History — {partyName} ({partyType})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3">
          {payments.map((payment) => (
            <div
              key={payment._id}
              className={cn(
                "flex justify-between items-center p-4 rounded border shadow-sm",
                payment.type === "IN" ? "bg-green-100" : "bg-red-100"
              )}
            >
              <div>
                <p className="text-lg font-semibold">
                  {payment.type === "IN" ? "+" : "-"}৳{payment.amount}
                </p>
                <p className="text-sm text-muted-foreground">{payment.note || "No note"}</p>
              </div>
              <div className="text-right">
                <Badge variant={payment.type === "IN" ? "success" : "destructive"}>
                  {payment.type}
                </Badge>
                <p className="text-sm">{format(new Date(payment.date), "dd MMM yyyy")}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
