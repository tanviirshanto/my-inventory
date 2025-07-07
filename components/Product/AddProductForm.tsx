"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  addProduct,
  fetchThicknesses,
  fetchHeights,
  fetchColors,
  fetchParties,
} from "@/lib/productActions";

export default function AddProductForm({ onAdded }: { onAdded: () => void }) {
  const [thicknesses, setThicknesses] = useState<string[]>([]);
  const [heights, setHeights] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [parties, setParties] = useState<{ _id: string; name: string }[]>([]);
  const [form, setForm] = useState({
    thickness: "",
    height: "",
    color: "",
    buyingPrice: "",
    party: "",
  });
  const [loading, setLoading] = useState(false);

useEffect(() => {
  async function loadOptions() {
    try {
      setThicknesses(await fetchThicknesses());
      setHeights(await fetchHeights());
      setColors(await fetchColors());
      const allParties = await fetchParties();
      setParties(allParties.filter(p => p.type === "SUPPLIER"));
    } catch {
      toast.error("Failed to load options");
    }
  }
  loadOptions();
}, []);


  const handleAdd = async () => {
    const { thickness, height, color, buyingPrice, party } = form;
    if (!thickness || !height || !color || !buyingPrice || !party) {
      toast.error("All fields are required");
      return;
    }
    setLoading(true);
    try {
      await addProduct({
        thickness,
        height,
        color,
        buyingPrice: Number(buyingPrice),
        party,
      });
      toast.success("Product added");
      setForm({
        thickness: "",
        height: "",
        color: "",
        buyingPrice: "",
        party: "",
      });
      onAdded();
    } catch (err: any) {
      toast.error(err.message || "Failed to add product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-3 max-w-md mx-auto mb-6">
      <select
        className="border rounded w-full px-3 py-2"
        value={form.thickness}
        onChange={(e) => setForm({ ...form, thickness: e.target.value })}
      >
        <option value="">Select Thickness</option>
        {thicknesses.map((t) => (
  <option key={t} value={t.name}>
    {t.name}
  </option>
))}
      </select>

      <select
        className="border rounded w-full px-3 py-2"
        value={form.height}
        onChange={(e) => setForm({ ...form, height: e.target.value })}
      >
        <option value="">Select Height</option>
        {heights.map((h) => (
  <option key={h._id} value={h.name}>
    {h.name}
  </option>
))}
      </select>

      <select
        className="border rounded w-full px-3 py-2"
        value={form.color}
        onChange={(e) => setForm({ ...form, color: e.target.value })}
      >
        <option value="">Select Color</option>
        {colors.map((c) => (
  <option key={c._id} value={c.name}>
    {c.name}
  </option>
))}
      </select>

      <input
        type="number"
        placeholder="Buying Price"
        className="border rounded w-full px-3 py-2"
        value={form.buyingPrice}
        onChange={(e) => setForm({ ...form, buyingPrice: e.target.value })}
      />

      <select
        className="border rounded w-full px-3 py-2"
        value={form.party}
        onChange={(e) => setForm({ ...form, party: e.target.value })}
      >
        <option value="">Select Party</option>
        {parties.map((p) => (
          <option key={p._id} value={p._id}>
            {p.name}
          </option>
        ))}
      </select>

      <button
        disabled={loading}
        onClick={handleAdd}
        className="bg-blue-600 text-white px-4 py-2 rounded w-full disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add Product"}
      </button>
    </div>
  );
}
