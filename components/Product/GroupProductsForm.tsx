"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import {
  fetchColors,
  fetchHeights,
  fetchParties,
  fetchThicknesses,
} from "@/lib/productActions";
import {
  addGroupedProducts,
  GroupedProductForm,
} from "@/lib/productGroupedActions";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
    setValue,
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

  const handleMultiCheck = (
    field: "heights" | "colors",
    value: string,
    checked: boolean
  ) => {
    const current = watch(field) || [];
    const updated = checked
      ? [...current, value]
      : current.filter((v: string) => v !== value);
    setValue(field, updated);
  };

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
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full max-w-4xl mx-auto grid grid-cols-3 gap-x-4 gap-y-5 items-start"
      style={{ minWidth: 320 }}
    >
      {/* Row 1: Thickness, Party, Buying Price */}
      <div className="flex flex-col">
        <Label className="mb-1 text-sm font-medium">Thickness</Label>
        <Select
          value={watch("thickness")}
          onValueChange={(val) => setValue("thickness", val)}
        >
          <SelectTrigger className="w-full min-w-[120px]">
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
        {errors.thickness && (
          <p className="text-xs text-red-600 mt-0.5">Required</p>
        )}
      </div>

      <div className="flex flex-col">
        <Label className="mb-1 text-sm font-medium">Party</Label>
        <Select
          value={watch("party")}
          onValueChange={(val) => setValue("party", val)}
        >
          <SelectTrigger className="w-full min-w-[120px]">
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
        {errors.party && <p className="text-xs text-red-600 mt-0.5">Required</p>}
      </div>

      <div className="flex flex-col">
        <Label className="mb-1 text-sm font-medium">Buying Price</Label>
        <Input
          type="number"
          placeholder="Price"
          {...register("buyingPrice", { required: true, min: 1 })}
          className="w-full min-w-[120px]"
        />
        {errors.buyingPrice && (
          <p className="text-xs text-red-600 mt-0.5">Must be at least 1</p>
        )}
      </div>

      {/* Row 2: Heights and Colors side by side */}
<div className="col-span-3 grid grid-cols-2 gap-x-4 gap-y-2">
  <div className="flex flex-col">
    <Label className="mb-1 text-sm font-medium">Heights</Label>
    <div className="flex flex-wrap gap-3 max-h-28 overflow-auto">
      {heights.map((h) => (
        <label
          key={h._id}
          className="flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <Checkbox
            checked={watch("heights")?.includes(h.name)}
            onCheckedChange={(checked) =>
              handleMultiCheck("heights", h.name, !!checked)
            }
          />
          {h.name}
        </label>
      ))}
    </div>
  </div>

  <div className="flex flex-col">
    <Label className="mb-1 text-sm font-medium">Colors</Label>
    <div className="flex flex-wrap gap-3 max-h-28 overflow-auto">
      {colors.map((c) => (
        <label
          key={c._id}
          className="flex items-center gap-2 text-sm whitespace-nowrap"
        >
          <Checkbox
            checked={watch("colors")?.includes(c.name)}
            onCheckedChange={(checked) =>
              handleMultiCheck("colors", c.name, !!checked)
            }
          />
          {c.name}
        </label>
      ))}
    </div>
  </div>
</div>


{/* Preview (col-span 2) */}
      {watchAll.thickness &&
        watchAll.party &&
        watchAll.buyingPrice &&
        watchAll.heights.length &&
        watchAll.colors.length && (
          <div className="col-span-3 bg-muted rounded p-3 text-xs shadow-inner max-h-32 overflow-auto flex  flex-wrap gap-5">
            <p>
              <strong>Thickness:</strong> {watchAll.thickness}
            </p>
            <p>
              <strong>Party:</strong> {watchAll.party}
            </p>
            <p>
              <strong>Price:</strong> {watchAll.buyingPrice}
            </p>
            <p>
              <strong>Heights:</strong> {watchAll.heights.join(", ")}
            </p>
            <p>
              <strong>Colors:</strong> {watchAll.colors.join(", ")}
            </p>
            <p className=" font-semibold">
              Variations: {watchAll.heights.length * watchAll.colors.length}
            </p>
          </div>
        )}
      

      {/* Submit Button (col-span 1 or 3 depending on preview) */}
      <div className="col-span-1">
        <Button type="submit" disabled={loading} className="w-full h-10">
          {loading ? "Adding..." : "Add Products"}
        </Button>
      </div>

      
    </form>
  );
}
