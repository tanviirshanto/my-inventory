"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchStockEntries,
  updateStockEntry,
  deleteStockEntry,
  resetStockEntries,
} from "@/lib/stockEntryActions";
import { fetchParties } from "@/lib/partyActions";

const ITEMS_PER_PAGE_OPTIONS = [5, 10, 25, 50];

export default function StockEntryList() {
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [editId, setEditId] = useState<string | null>(null);
  const [parties, setParties] = useState<any[]>([]);
  const [quantity, setQuantity] = useState<number | null>(null);
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [note, setNote] = useState("");
  const [date, setDate] = useState("");
  const [partyId, setPartyId] = useState("");

  useEffect(() => {
    loadEntries();
    fetchParties().then((res) => setParties(res.data));
  }, []);

  const loadEntries = async () => {
    setLoading(true);
    try {
      const data = await fetchStockEntries();
      setEntries(data);
    } catch {
      toast.error("Failed to load entries");
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const sortedEntries = useMemo(() => {
    return [...entries].sort((a, b) => {
      let valA = a[sortKey];
      let valB = b[sortKey];

      if (sortKey === "date") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      } else if (sortKey === "party") {
        valA = a.party?.name || "";
        valB = b.party?.name || "";
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [entries, sortKey, sortOrder]);

  const paginatedEntries = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedEntries.slice(start, start + itemsPerPage);
  }, [sortedEntries, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(entries.length / itemsPerPage);

  const startEdit = (entry: any) => {
    setEditId(entry._id);
    setQuantity(entry.quantity);
    setType(entry.type);
    setNote(entry.note || "");
    setDate(entry.date?.slice(0, 10));
    setPartyId(entry.party._id);
  };

  const cancelEdit = () => {
    setEditId(null);
    setQuantity(null);
    setType("IN");
    setNote("");
    setDate("");
    setPartyId("");
  };

  const saveEdit = async () => {
    if (!editId || quantity == null || !date || !partyId) {
      toast.error("Missing required fields");
      return;
    }

    try {
      await updateStockEntry(editId, { quantity, type, note, date, party: partyId });
      toast.success("Entry updated");
      cancelEdit();
      loadEntries();
    } catch {
      toast.error("Failed to update entry");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await deleteStockEntry(id);
      toast.success("Entry deleted");
      loadEntries();
    } catch {
      toast.error("Failed to delete entry");
    }
  };

  const handleReset = async () => {
    if (!confirm("Reset all entries?")) return;
    try {
      await resetStockEntries();
      toast.success("All entries reset");
      loadEntries();
    } catch {
      toast.error("Failed to reset entries");
    }
  };

  return (
    <div className="max-w-full p-4 border rounded shadow">
      <div className="flex flex-wrap justify-between mb-4 items-center">
        <h2 className="text-lg font-semibold">Stock Entry List</h2>

        <div className="flex gap-3 items-center">
          <label>Items per page:</label>
          <Select value={String(itemsPerPage)} onValueChange={(val) => setItemsPerPage(Number(val))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ITEMS_PER_PAGE_OPTIONS.map((num) => (
                <SelectItem key={num} value={String(num)}>
                  {num}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="destructive" onClick={handleReset}>
            Reset All
          </Button>
        </div>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : entries.length === 0 ? (
        <p>No stock entries found.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead onClick={() => handleSort("party")} className="cursor-pointer">Party</TableHead>
                <TableHead>Type</TableHead>
                <TableHead onClick={() => handleSort("quantity")} className="cursor-pointer">Qty</TableHead>
                <TableHead onClick={() => handleSort("date")} className="cursor-pointer">Date</TableHead>
                <TableHead>Note</TableHead>
                <TableHead className="text-right">Item Total</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEntries.map((entry) => (
                <TableRow key={entry._id}>
                  <TableCell>{entry.product.thickness}-{entry.product.height}-{entry.product.color}</TableCell>
                  <TableCell>
                    {editId === entry._id ? (
                      <Select value={partyId} onValueChange={setPartyId}>
                        <SelectTrigger><SelectValue placeholder="Select Party" /></SelectTrigger>
                        <SelectContent>
                          {parties.map((p) => (
                            <SelectItem key={p._id} value={p._id}>
                              {p.name} ({p.type})
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      entry.party.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === entry._id ? (
                      <Select value={type} onValueChange={(val) => setType(val as "IN" | "OUT")}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="IN">IN</SelectItem>
                          <SelectItem value="OUT">OUT</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      entry.type
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === entry._id ? (
                      <Input
                        type="number"
                        value={quantity ?? 0}
                        onChange={(e) => setQuantity(Number(e.target.value))}
                      />
                    ) : (
                      entry.quantity
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === entry._id ? (
                      <Input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                      />
                    ) : (
                      new Date(entry.date).toLocaleDateString()
                    )}
                  </TableCell>
                  <TableCell>
                    {editId === entry._id ? (
                      <Input value={note} onChange={(e) => setNote(e.target.value)} />
                    ) : (
                      entry.note || "-"
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {entry.itemTotal ? entry.itemTotal.toFixed(2) : "-"}
                  </TableCell>
                  <TableCell className="text-center space-x-2">
                    {editId === entry._id ? (
                      <>
                        <Button size="sm" variant="success" onClick={saveEdit}>
                          Save
                        </Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="outline" onClick={() => startEdit(entry)}>
                          Edit
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(entry._id)}>
                          Delete
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-4 flex justify-between items-center">
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <div className="space-x-2">
              <Button
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Prev
              </Button>
              <Button
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
