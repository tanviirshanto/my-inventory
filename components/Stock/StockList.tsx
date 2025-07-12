"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import {
  fetchStocks,
  editStock,
  deleteStock,
  resetStock,
} from "@/lib/stockActions";

export default function StockList() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const loadStocks = async (opts: { reset?: boolean } = {}) => {
    if (opts.reset) setPage(1);
    setLoading(true);
    try {
      const data = await fetchStocks({ page: opts.reset ? 1 : page, q: search });
      if (opts.reset) setStocks(data.items);
      else setStocks((prev) => [...prev, ...data.items]);
      setTotal(data.total);
    } catch {
      toast.error("Failed to load stocks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStocks({ reset: true });
  }, [search]);

  const canLoadMore = stocks.length < total;
  const totalPages = Math.ceil(total / 10);

  return (
    <div className="w-full mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">Stock List</h2>
        <Button variant="destructive" size="sm" onClick={async () => { await resetStock(); loadStocks({ reset: true }); }}>
          Reset All
        </Button>
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Search product..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button onClick={() => loadStocks({ reset: true })}>Search</Button>
      </div>

      <div className="overflow-x-auto rounded border shadow-sm">
        <table className="w-full text-center">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th>Product</th>
              <th>Initial Qty</th>
              <th>Qty</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stocks.map((s) => (
              <StockRow
                key={s._id}
                stock={s}
                onUpdated={loadStocks}
                onDeleted={loadStocks}
              />
            ))}
          </tbody>
        </table>
      </div>

      {canLoadMore && (
        <div className="text-center">
          <Button disabled={loading} onClick={() => { setPage(page + 1); loadStocks(); }}>
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
}

function StockRow({ stock, onUpdated, onDeleted }) {
  const [editId, setEditId] = useState<string | null>(null);
  const [newQty, setNewQty] = useState(stock.quantity);
  const [newInit, setNewInit] = useState(stock.intialQuantity);

  return (
    <tr className="even:bg-muted">
      <td className="p-2">{`${stock.product.thickness} - ${stock.product.height} - ${stock.product.color}`}</td>
      {[newInit, newQty].map((val, idx) =>
        <td className="p-2">
          {editId === stock._id ? (
            <Input
              type="number" min={0}
              value={idx === 0 ? newInit : newQty}
              onChange={(e) => idx === 0 ? setNewInit(Number(e.target.value)) : setNewQty(Number(e.target.value))}
            />
          ) : (
            idx === 0 ? stock.intialQuantity : stock.quantity
          )}
        </td>
      )}
      <td className="p-2 space-x-2">
        {editId === stock._id ? (
          <>
            <Button size="sm" variant="ghost" onClick={async () => { await editStock(stock._id, newQty, newInit); setEditId(null); onUpdated({ reset: true }); }}>Save</Button>
            <Button size="sm" variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
          </>
        ) : (
          <Button size="sm" onClick={() => setEditId(stock._id)}>Edit</Button>
        )}
      </td>
    </tr>
  );
}
