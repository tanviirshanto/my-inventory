"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchStocks, updateStock, deleteStock, resetStock } from "@/lib/stockActions";

export default function StockList() {
  const [stocks, setStocks] = useState<any[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [newQty, setNewQty] = useState<number | null>(null);
  const [newInitialQty, setNewInitialQty] = useState<number | null>(null);

  useEffect(() => {
    loadStocks();
  }, []);

  const loadStocks = async () => {
    try {
      const data = await fetchStocks();
      setStocks(data);
    } catch {
      toast.error("Failed to load stock records.");
    }
  };

  const handleUpdate = async (id: string) => {
    if (
      newQty === null || newQty < 0 ||
      newInitialQty === null || newInitialQty < 0
    ) {
      toast.error("Please enter valid quantities.");
      return;
    }

    try {
      await updateStock(id, newQty, newInitialQty);
      toast.success("Stock updated successfully.");
      cancelEdit();
      loadStocks();
    } catch {
      toast.error("Failed to update stock.");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this stock entry?")) return;

    try {
      await deleteStock(id);
      toast.success("Stock deleted successfully.");
      loadStocks();
    } catch {
      toast.error("Failed to delete stock.");
    }
  };

  const handleResetAll = async () => {
    if (!window.confirm("Reset all stock quantities to zero?")) return;

    try {
      await resetStock();
      toast.success("All stock quantities have been reset.");
      loadStocks();
    } catch {
      toast.error("Failed to reset stock quantities.");
    }
  };

  const startEdit = (stock: any) => {
    setEditId(stock._id);
    setNewQty(stock.quantity);
    setNewInitialQty(stock.intialQuantity);
  };

  const cancelEdit = () => {
    setEditId(null);
    setNewQty(null);
    setNewInitialQty(null);
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 px-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Stock List</h2>
        <button
          onClick={handleResetAll}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
          aria-label="Reset all stock quantities"
          type="button"
        >
          Reset All Quantities
        </button>
      </div>

      {stocks.length === 0 ? (
        <p className="text-center text-gray-600">No stock records found.</p>
      ) : (
        <div className="overflow-x-auto rounded border border-gray-300 shadow-sm">
          <table className="w-full table-auto text-center">
            <thead className="bg-gray-100">
              <tr>
                <th className="border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700">Product</th>
                <th className="border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700">Initial Quantity</th>
                <th className="border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700">Quantity</th>
                <th className="border border-gray-300 px-5 py-3 text-sm font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {stocks.map((stock) => (
                <tr key={stock._id} className="even:bg-gray-50">
                  <td className="border border-gray-300 px-4 py-2 text-gray-700 whitespace-nowrap">
                    {stock.product?.thickness} - {stock.product?.height} - {stock.product?.color}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    {editId === stock._id ? (
                      <input
                        type="number"
                        min={0}
                        value={newInitialQty ?? stock.intialQuantity}
                        onChange={(e) => setNewInitialQty(Number(e.target.value))}
                        className="w-full border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Edit initial quantity"
                      />
                    ) : (
                      <span>{stock.intialQuantity}</span>
                    )}
                  </td>

                  <td className="border border-gray-300 px-4 py-2">
                    {editId === stock._id ? (
                      <input
                        type="number"
                        min={0}
                        value={newQty ?? stock.quantity}
                        onChange={(e) => setNewQty(Number(e.target.value))}
                        className="w-full border rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
                        aria-label="Edit quantity"
                      />
                    ) : (
                      <span>{stock.quantity}</span>
                    )}
                  </td>

                  <td className="border border-gray-300 px-4 py-2 space-x-3">
                    {editId === stock._id ? (
                      <>
                        <button
                          onClick={() => handleUpdate(stock._id)}
                          className="text-green-600 hover:text-green-800 font-semibold"
                          aria-label="Save stock changes"
                          type="button"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEdit}
                          className="text-gray-600 hover:text-gray-900 font-semibold"
                          aria-label="Cancel editing stock"
                          type="button"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEdit(stock)}
                          className="text-blue-600 hover:text-blue-800 font-semibold"
                          aria-label={`Edit stock for product ${stock.product?.thickness} ${stock.product?.height} ${stock.product?.color}`}
                          type="button"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(stock._id)}
                          className="text-red-600 hover:text-red-800 font-semibold"
                          aria-label="Delete stock"
                          type="button"
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
