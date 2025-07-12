"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Card, CardContent } from "@/components/ui/card";


import {
  fetchParties,
} from "@/lib/partyActions";
import {
  addPayment,
  deletePayment,
  editPayment,
  fetchPayments,
  resetPayments,
} from "@/lib/paymentActions";
import PaymentForm from "@/components/Payment/PaymentForm";
import PaymentTable from "@/components/Payment/PaymentTable";

export default function PaymentListPage() {
  const [payments, setPayments] = useState<any[]>([]);
  const [parties, setParties] = useState<any[]>([]);

  const [filterParty, setFilterParty] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const [editingPayment, setEditingPayment] = useState<any | null>(null);

  const loadData = async () => {
    try {
      const allPayments = await fetchPayments();
      setPayments(allPayments);
      const allParties = await fetchParties();
      setParties(allParties.data);
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleAddOrUpdate = async (data: {
    partyId: string;
    amount: number;
    type: string;
    note: string;
    date: string;
  }) => {
    try {
      if (editingPayment) {
        await editPayment(editingPayment._id, {
          party: data.partyId,
          amount: data.amount,
          type: data.type,
          note: data.note,
          date: data.date,
        });
        toast.success("Payment updated");
      } else {
        await addPayment({
          party: data.partyId,
          amount: data.amount,
          type: data.type,
          note: data.note,
          date: data.date,
        });
        toast.success("Payment added");
      }
      setEditingPayment(null);
      loadData();
    } catch {
      toast.error("Failed to save payment");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this payment?")) return;
    try {
      await deletePayment(id);
      toast.success("Payment deleted");
      loadData();
    } catch {
      toast.error("Failed to delete payment");
    }
  };

  const handleEdit = (payment: any) => {
    setEditingPayment(payment);
  };

  const handleCancelEdit = () => {
    setEditingPayment(null);
  };

  const handleResetAll = async () => {
    if (!confirm("Are you sure you want to reset all payments? This action cannot be undone.")) return;
    try {
      await resetPayments();
      toast.success("All payments reset");
      loadData();
    } catch {
      toast.error("Failed to reset payments");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-5 ">
      <h1 className="text-2xl font-bold mb-8">Manage Payments</h1>
      <Card className="p-4">
      <CardContent>
        <PaymentForm
          parties={parties}
          editingPayment={editingPayment}
          onSubmit={handleAddOrUpdate}
          onCancelEdit={handleCancelEdit}
        />

        <PaymentTable
          payments={payments}
          parties={parties}
          onEdit={handleEdit}
          onDelete={handleDelete}
          filterParty={filterParty}
          setFilterParty={setFilterParty}
          filterDate={filterDate}
          setFilterDate={setFilterDate}
          page={page}
          setPage={setPage}
          itemsPerPage={itemsPerPage}
          onResetAll={handleResetAll}
        />
      </CardContent>
    </Card>
    </div>
    
  );
}
