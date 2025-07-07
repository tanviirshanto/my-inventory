"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchProducts } from "@/lib/productActions"; // create if missing
import { addStock, resetStock } from "@/lib/stockActions";

export default function StockForm() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchProducts();
        setProducts(res);
      } catch {
        toast.error("Failed to load products");
      }
    }
    load();
  }, []);

  const handleAdd = async () => {
    if (!productId) return toast.error("Select a product");

    try {
      await addStock({ product: productId, quantity });
      toast.success("Stock added");
      setProductId("");
      setQuantity(0);
    } catch (err: any) {
      toast.error(err.message || "Failed to add stock");
    }
  };

  const handleReset = async () => {
    const confirmReset = confirm("Are you sure you want to reset all stock?");
    if (!confirmReset) return;

    try {
      await resetStock();
      toast.success("All stock reset");
    } catch {
      toast.error("Failed to reset stock");
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      <h2 className="text-xl font-semibold">Manage Stock</h2>

      <select
        value={productId}
        onChange={(e) => setProductId(e.target.value)}
        className="w-full border px-3 py-2 rounded"
      >
        <option value="">Select Product</option>
        {products.map((p) => (
          <option key={p._id} value={p._id}>
            {`${p.thickness} - ${p.height} - ${p.color}`}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={quantity}
        onChange={(e) => setQuantity(Number(e.target.value))}
        placeholder="Quantity"
        className="w-full border px-3 py-2 rounded"
      />

      <button
        onClick={handleAdd}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Add Stock
      </button>

      <button
        onClick={handleReset}
        className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
      >
        Reset All Stock
      </button>
    </div>
  );
}
