"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { addDueTransaction } from "@/lib/dueTransactionActions";
import { fetchParties } from "@/lib/partyActions";

export default function AddDueTransactionForm({ onAdded }: { onAdded?: () => void }) {
  const [amount, setAmount] = useState("");
  const [party, setParty] = useState("");
  const [type, setType] = useState("due");
  const [note, setNote] = useState("");
  const [parties, setParties] = useState<{ _id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadParties = async () => {
      try {
        setLoading(true);
        const res = await fetchParties("ALL", 1, 100); // fetch 100 parties, adjust if needed
        setParties(res.data || []);
      } catch (err) {
        toast.error("Failed to load parties");
      } finally {
        setLoading(false);
      }
    };
    loadParties();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!party) {
      toast.error("Please select a party");
      return;
    }
    if (!amount || Number(amount) <= 0) {
      toast.error("Amount must be greater than zero");
      return;
    }

    try {
      await addDueTransaction({ amount: Number(amount), party, type, note, date: new Date() });
      toast.success("Transaction added");
      setAmount("");
      setNote("");
      setParty("");
      setType("due");
      if (onAdded) onAdded();
    } catch (err) {
      toast.error("Failed to add transaction");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full lg:w-1/2">
      <div>
        <label className="block mb-1 font-medium">Party</label>
        <Select value={party} onValueChange={setParty} disabled={loading}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={loading ? "Loading parties..." : "Select Party"} />
          </SelectTrigger>
          <SelectContent>
            {parties.map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          min={0}
          required
        />
      </div>

      <div>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full border rounded px-3 py-2"
        >
          <option value="due">Due</option>
          <option value="payment">Payment</option>
        </select>
      </div>

      <div>
        <Textarea
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full">
        Add Transaction
      </Button>
    </form>
  );
}
