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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

export default function AddProductForm({ onAdded }: { onAdded: () => void }) {
  const [thicknesses, setThicknesses] = useState<{ _id: string; name: string }[]>([]);
  const [heights, setHeights] = useState<{ _id: string; name: string }[]>([]);
  const [colors, setColors] = useState<{ _id: string; name: string }[]>([]);
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
        setParties(allParties.filter((p) => p.type === "SUPPLIER"));
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
    <div className="w-full mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 space-y-2 items-center ">
        {/* Row 1 */}
        <div className="space-y-1">
          <Label>Thickness</Label>
          <Select
            value={form.thickness}
            onValueChange={(value) => setForm({ ...form, thickness: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Thickness" />
            </SelectTrigger>
            <SelectContent>
              {thicknesses.map((t) => (
                <SelectItem key={t._id} value={t.name}>
                  {t.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Height</Label>
          <Select
            value={form.height}
            onValueChange={(value) => setForm({ ...form, height: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Height" />
            </SelectTrigger>
            <SelectContent>
              {heights.map((h) => (
                <SelectItem key={h._id} value={h.name}>
                  {h.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label>Color</Label>
          <Select
            value={form.color}
            onValueChange={(value) => setForm({ ...form, color: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Color" />
            </SelectTrigger>
            <SelectContent>
              {colors.map((c) => (
                <SelectItem key={c._id} value={c.name}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Row 2 */}
        <div className="space-y-1">
          <Label>Buying Price</Label>
          <Input
            type="number"
            placeholder="Buying Price"
            value={form.buyingPrice}
            onChange={(e) => setForm({ ...form, buyingPrice: e.target.value })}
          />
        </div>

        <div className="space-y-1">
          <Label>Party</Label>
          <Select
            value={form.party}
            onValueChange={(value) => setForm({ ...form, party: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Party" />
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

        <div className="flex items-end mt-2">
          <Button
            className="w-full"
            onClick={handleAdd}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}
