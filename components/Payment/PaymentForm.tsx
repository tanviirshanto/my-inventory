"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentFormProps {
  parties: any[];
  editingPayment: any | null;
  onSubmit: (data: {
    partyId: string;
    amount: number;
    type: string;
    note: string;
    date: string;
  }) => Promise<void>;
  onCancelEdit: () => void;
}

export default function PaymentForm({
  parties,
  editingPayment,
  onSubmit,
  onCancelEdit,
}: PaymentFormProps) {
  const [partyId, setPartyId] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [type, setType] = useState("");

  useEffect(() => {
    if (editingPayment) {
      setPartyId(editingPayment.party._id);
      setAmount(editingPayment.amount);
      setNote(editingPayment.note || "");
      setType(editingPayment.type);
      setDate(editingPayment.date.slice(0, 10));
    } else {
      setPartyId("");
      setAmount("");
      setNote("");
      setType("");
      setDate(new Date().toISOString().slice(0, 10));
    }
  }, [editingPayment]);

  const isValid = partyId && amount !== "" && type && date;

  const handleSubmit = async () => {
    if (!isValid) {
      toast.error("Please fill in all required fields");
      return;
    }
    await onSubmit({ partyId, amount: Number(amount), type, note, date });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 mb-6">
      <div>
        <Label className="mb-2">Party</Label>
        <Select value={partyId} onValueChange={setPartyId}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Party" />
          </SelectTrigger>
          <SelectContent>
            {parties.map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.name} ({p.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2">Amount</Label>
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) =>
            setAmount(e.target.value === "" ? "" : Number(e.target.value))
          }
          min={0}
        />
      </div>

      <div>
        <Label className="mb-2">Type</Label>
        <Select value={type} onValueChange={setType}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="IN">IN</SelectItem>
            <SelectItem value="OUT">OUT</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2">Date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div>
        <Label className="mb-2">Note</Label>
        <Input
          type="text"
          placeholder="Note (optional)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      <div className="sm:col-span-5 flex gap-2">
        <Button onClick={handleSubmit} disabled={!isValid} className="flex-1">
          {editingPayment ? "Update Payment" : "Add Payment"}
        </Button>
        {editingPayment && (
          <Button variant="outline" onClick={onCancelEdit}>
            Cancel
          </Button>
        )}
      </div>
    </div>
  );
}
