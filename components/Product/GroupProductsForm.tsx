"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";
import {
  fetchColors,
  fetchHeights,
  fetchParties,
  fetchThicknesses,
} from "@/lib/productActions";
import { addGroupedProducts, GroupedProductForm } from "@/lib/productGroupedActions";

type Option = { _id: string; name: string; type?: string };

export default function GroupedProductsForm() {
  const [thicknesses, setThicknesses] = useState<Option[]>([]);
  const [heights, setHeights] = useState<Option[]>([]);
  const [colors, setColors] = useState<Option[]>([]);
  const [parties, setParties] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<GroupedProductForm>({
    defaultValues: {
      thickness: "",
      party: "",
      buyingPrice: 0,
      heights: [],
      colors: [],
    },
  });

  const watchAll = watch();

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

  const onSubmit = async (data: GroupedProductForm) => {
    if (!data.heights.length || !data.colors.length) {
      toast.error("Select at least one height and color");
      return;
    }
    setLoading(true);
    try {
      const res = await addGroupedProducts(data);
      toast.success(res.message || "Products added");
      reset();
    } catch (err: any) {
      toast.error(err.message || "Failed to add products");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold">Add Grouped Products</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <select {...register("thickness", { required: true })} className="w-full border rounded px-3 py-2">
          <option value="">Select Thickness</option>
          {thicknesses.map((t) => (
            <option key={t._id} value={t.name}>
              {t.name}
            </option>
          ))}
        </select>
        {errors.thickness && <p className="text-red-600 text-sm">Thickness is required</p>}

        <select {...register("party", { required: true })} className="w-full border rounded px-3 py-2">
          <option value="">Select Party</option>
          {parties.map((p) => (
            <option key={p._id} value={p._id}>
              {p.name}
            </option>
          ))}
        </select>
        {errors.party && <p className="text-red-600 text-sm">Party is required</p>}

        <input
          type="number"
          placeholder="Buying Price"
          {...register("buyingPrice", { required: true, min: 1 })}
          className="w-full border rounded px-3 py-2"
        />
        {errors.buyingPrice && <p className="text-red-600 text-sm">Buying price must be at least 1</p>}

        <fieldset className="border p-3 rounded">
          <legend className="font-semibold">Select Heights</legend>
          <div className="flex flex-wrap gap-4">
            {heights.map((h) => (
              <label key={h._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={h.name}
                  {...register("heights")}
                />
                {h.name}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="border p-3 rounded">
          <legend className="font-semibold">Select Colors</legend>
          <div className="flex flex-wrap gap-4">
            {colors.map((c) => (
              <label key={c._id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  value={c.name}
                  {...register("colors")}
                />
                {c.name}
              </label>
            ))}
          </div>
        </fieldset>

        {/* Preview Summary */}
        {(watchAll.thickness && watchAll.party && watchAll.buyingPrice && watchAll.heights.length && watchAll.colors.length) ? (
          <div className="bg-gray-50 p-3 rounded border text-sm">
            <h4 className="font-semibold mb-2">Preview</h4>
            <p><strong>Thickness:</strong> {watchAll.thickness}</p>
            <p><strong>Party ID:</strong> {watchAll.party}</p>
            <p><strong>Buying Price:</strong> {watchAll.buyingPrice}</p>
            <p><strong>Heights:</strong> {watchAll.heights.join(", ")}</p>
            <p><strong>Colors:</strong> {watchAll.colors.join(", ")}</p>
            <p className="mt-2 font-medium">Total Variations: {watchAll.heights.length * watchAll.colors.length}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Products"}
        </button>
      </form>
    </div>
  );
}
