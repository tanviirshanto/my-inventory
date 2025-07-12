"use client";

import { useEffect, useState } from "react";
import {
  fetchDueTransactions,
  deleteDueTransaction,
  resetDueTransactions,
  editDueTransactions,
} from "@/lib/dueTransactionActions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";

export default function DueTransactionList() {
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    amount: "",
    type: "due",
    note: "",
  });

  const loadData = async () => {
    try {
      const res = await fetchDueTransactions(page, 10);
      setData(res.data);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to fetch");
    }
  };

  useEffect(() => {
    loadData();
  }, [page]);

  const handleDelete = async (id: string) => {
    try {
      await deleteDueTransaction(id);
      toast.success("Deleted");
      loadData();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleReset = async () => {
    try {
      await resetDueTransactions();
      toast.success("All reset");
      loadData();
    } catch {
      toast.error("Reset failed");
    }
  };

  const handleEditClick = (item) => {
    setEditingId(item._id);
    setEditForm({
      amount: item.amount,
      type: item.type,
      note: item.note || "",
    });
  };

  const handleSave = async (item) => {
    try {
      await editDueTransactions({
        _id: item._id,
        party: item.party._id || item.party,
        amount: Number(editForm.amount),
        type: editForm.type,
        note: editForm.note,
        date: item.date,
      });
      toast.success("Updated");
      setEditingId(null);
      loadData();
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  return (
    <div className="w-full lg:w-1/2">
      <Button onClick={handleReset} variant="destructive" className="mb-2">
        Reset All
      </Button>
      <div className="border rounded p-2 max-h-[500px] overflow-y-auto space-y-3">
        {data.map((item) => (
          <div
            key={item._id}
            className="flex flex-col border-b pb-2 last:border-none"
          >
            {editingId === item._id ? (
              <div className="space-y-2">
                <Input
                  type="number"
                  value={editForm.amount}
                  onChange={(e) =>
                    setEditForm({ ...editForm, amount: e.target.value })
                  }
                />
                <select
                  value={editForm.type}
                  onChange={(e) =>
                    setEditForm({ ...editForm, type: e.target.value })
                  }
                  className="border px-2 py-1 rounded w-full"
                >
                  <option value="due">Due</option>
                  <option value="payment">Payment</option>
                </select>
                <Textarea
                  value={editForm.note}
                  onChange={(e) =>
                    setEditForm({ ...editForm, note: e.target.value })
                  }
                />
                <div className="flex gap-2">
                  <Button onClick={() => handleSave(item)}>Save</Button>
                  <Button variant="ghost" onClick={() => setEditingId(null)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p>
                    <strong
                      className={
                        item.type === "due"
                          ? "text-red-500"
                          : "text-green-600"
                      }
                    >
                      {item.type.toUpperCase()}
                    </strong>{" "}
                    - {item.amount} ৳
                  </p>
                  <p className="text-sm font-medium text-blue-700">
                    {item.party?.name || "Unknown Party"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.note || ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="ghost" onClick={() => handleEditClick(item)}>
                    ✏️
                  </Button>
                  <Button variant="ghost" onClick={() => handleDelete(item._id)}>
                    🗑
                  </Button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page === 1}
        >
          Prev
        </Button>
        <span className="mt-1">Page {page} of {totalPages}</span>
        <Button
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
