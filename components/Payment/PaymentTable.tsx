"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface PaymentTableProps {
  payments: any[];
  parties: any[];
  onEdit: (payment: any) => void;
  onDelete: (id: string) => void;
  filterParty: string;
  setFilterParty: (val: string) => void;
  filterDate: string;
  setFilterDate: (val: string) => void;
  page: number;
  setPage: (val: number) => void;
  itemsPerPage: number;
  onResetAll: () => void;
}

export default function PaymentTable({
  payments,
  parties,
  onEdit,
  onDelete,
  filterParty,
  setFilterParty,
  filterDate,
  setFilterDate,
  page,
  setPage,
  itemsPerPage,
  onResetAll,
}: PaymentTableProps) {
  const filtered = payments.filter((p) => {
    const partyMatch = filterParty === "all" || !filterParty || p.party._id === filterParty;
    const dateMatch = !filterDate || p.date.slice(0, 10) === filterDate;
    return partyMatch && dateMatch;
  });

  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <h2 className="text-lg font-semibold">💵 Payments</h2>
        <Button variant="destructive" size="sm" onClick={onResetAll} className="mt-2 sm:mt-0">
          Reset All
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-4">
        <Select
          value={filterParty}
          onValueChange={(val) => {
            setFilterParty(val);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full max-w-xs">
            <SelectValue placeholder="Filter by Party" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Parties</SelectItem>
            {parties.map((p) => (
              <SelectItem key={p._id} value={p._id}>
                {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          type="date"
          value={filterDate}
          onChange={(e) => {
            setFilterDate(e.target.value);
            setPage(1);
          }}
          className="max-w-xs"
          placeholder="Filter by Date"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="border px-3 py-2 text-left">Party</th>
              <th className="border px-3 py-2 text-right">Amount</th>
              <th className="border px-3 py-2 text-left">Type</th>
              <th className="border px-3 py-2 text-left">Date</th>
              <th className="border px-3 py-2 text-left">Note</th>
              <th className="border px-3 py-2 text-center w-24">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-4 text-muted-foreground">
                  No payments found.
                </td>
              </tr>
            )}
            {paginated.map((p) => (
              <tr key={p._id}>
                <td className="border px-3 py-2">{p.party.name}</td>
                <td className="border px-3 py-2 text-right">{p.amount.toFixed(2)}</td>
                <td className="border px-3 py-2">{p.type}</td>
                <td className="border px-3 py-2">{new Date(p.date).toLocaleDateString()}</td>
                <td className="border px-3 py-2">{p.note || "-"}</td>
                <td className="border px-3 py-2 text-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Edit payment"
                    onClick={() => onEdit(p)}
                  >
                    ✏️
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Delete payment"
                    onClick={() => onDelete(p._id)}
                  >
                    🗑️
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <Button
              key={i}
              variant={page === i + 1 ? "default" : "outline"}
              size="sm"
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </Button>
          ))}
        </div>
      )}
    </>
  );
}
