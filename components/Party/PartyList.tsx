"use client";

import {
  deleteParty,
  editParty,
  fetchParties,
  resetParties,
} from "@/lib/partyActions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function PartyList() {
  const [parties, setParties] = useState<any[]>([]);
  const [filter, setFilter] = useState<"ALL" | "CUSTOMER" | "SUPPLIER">("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadParties = async () => {
    try {
      const res = await fetchParties(filter, page, 5, search);
      setParties(res.data);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to fetch parties");
    }
  };

  useEffect(() => {
    loadParties();
  }, [filter, page]);

  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(1);
      loadParties();
    }, 300);
    return () => clearTimeout(delay);
  }, [search]);

  const handleEdit = (party: any) => {
    setEditingId(party._id);
    setForm({
      name: party.name,
      phone: party.phone,
      email: party.email,
      address: party.address,
    });
  };

  const handleSave = async () => {
    try {
      if (!editingId) return;
      await editParty(editingId, form);
      toast.success("Updated successfully");
      setEditingId(null);
      loadParties();
    } catch {
      toast.error("Failed to update");
    }
  };

  const handleReset = async () => {
    if (confirm("Reset all parties?")) {
      await resetParties();
      loadParties();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="space-y-2">
        <div className="flex gap-2 items-center">
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search party name..."
            className="flex-1"
          />
          <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All</SelectItem>
              <SelectItem value="CUSTOMER">Customers</SelectItem>
              <SelectItem value="SUPPLIER">Suppliers</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="destructive" onClick={handleReset}>
            Reset All
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {parties.length === 0 ? (
          <p className="text-muted-foreground text-center">No parties found.</p>
        ) : (
          parties.map((party) => (
            <div
              key={party._id}
              className="border rounded-md p-4 flex justify-between items-start"
            >
              {editingId === party._id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full">
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="Name"
                  />
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="Phone"
                  />
                  <Input
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="Email"
                  />
                  <Input
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="Address"
                  />
                  <div className="flex gap-2 mt-2">
                    <Button onClick={handleSave} size="sm">Save</Button>
                    <Button
                      onClick={() => setEditingId(null)}
                      variant="ghost"
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between items-center w-full">
                    <p className="font-semibold">
                      {party.name}{" "}
                      <span className="text-xs text-muted-foreground">({party.type})</span>
                    </p>
                    <div className="flex gap-2">
                      <Link href={`/payments/party/${party._id}`}>
                        <Button size="sm" variant="outline">Payments</Button>
                      </Link>
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(party)}>
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={async () => {
                          await deleteParty(party._id);
                          toast.success("Deleted");
                          loadParties();
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    📞 {party.phone} | 📧 {party.email}
                  </p>
                  <p className="text-sm text-muted-foreground">📍 {party.address}</p>
                </div>
              )}
            </div>
          ))
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <span className="text-sm">
              Page <strong>{page}</strong> of <strong>{totalPages}</strong>
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
