"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { fetchParties } from "@/lib/partyActions";
import { fetchProducts } from "@/lib/productActions";
import { createStockEntry } from "@/lib/stockEntryActions";
import { fetchThicknesses } from "@/lib/thicknessActions";
import { useEffect, useState, useRef } from "react";
import toast from "react-hot-toast";

export default function StockEntryForm() {
  const [thicknesses, setThicknesses] = useState<{ _id: string; name: string }[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [parties, setParties] = useState<any[]>([]);

  const [selectedThickness, setSelectedThickness] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [selectedParty, setSelectedParty] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [type, setType] = useState<"IN" | "OUT">("IN");
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [note, setNote] = useState("");

  const thicknessRef = useRef<HTMLDivElement>(null);
  const productRef = useRef<HTMLDivElement>(null);
  const partyRef = useRef<HTMLDivElement>(null);
  const quantityRef = useRef<HTMLDivElement>(null);
  const typeRef = useRef<HTMLDivElement>(null);
  const dateRef = useRef<HTMLDivElement>(null);
  const noteRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchThicknesses().then(setThicknesses);
    fetchProducts().then(setProducts);
    fetchParties().then((res) => setParties(res.data));
  }, []);

  useEffect(() => {
    const filtered = selectedThickness
      ? products.filter((p) => p.thickness === selectedThickness)
      : products;
    setFilteredProducts(filtered);
  }, [selectedThickness, products]);

  function handleArrowKey(
    e: React.KeyboardEvent<HTMLDivElement>,
    currentRef: React.RefObject<HTMLDivElement>,
    refs: React.RefObject<HTMLDivElement>[]
  ) {
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const currentIndex = refs.findIndex((ref) => ref === currentRef);
      if (currentIndex === -1) return;
      const nextIndex =
        e.key === "ArrowRight"
          ? (currentIndex + 1) % refs.length
          : (currentIndex - 1 + refs.length) % refs.length;
      const nextRef = refs[nextIndex];
      if (nextRef?.current) {
        const focusable = nextRef.current.querySelector<HTMLElement>(
          'input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusable?.focus();
      }
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedProduct) return toast.error("Select a product");
    if (!selectedParty) return toast.error("Select a party");
    if (quantity <= 0) return toast.error("Quantity must be greater than 0");

    try {
      await createStockEntry({
        product: selectedProduct,
        party: selectedParty,
        quantity,
        type,
        date,
        note,
      });
      toast.success("Stock entry added");

      setSelectedThickness("");
      setSelectedProduct("");
      setQuantity(0);
      setType("IN");
      setNote("");
      
    } catch {
      toast.error("Failed to add stock entry");
    }
  }

  const inputRefs = [
    thicknessRef,
    productRef,
    partyRef,
    quantityRef,
    typeRef,
    dateRef,
    noteRef,
  ];

  return (
    <Card className="w-full mx-auto p-4">
      <CardHeader>
        <CardTitle>➕ Add Stock Entry</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Row 1 */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2" ref={thicknessRef} tabIndex={-1} onKeyDown={(e) => handleArrowKey(e, thicknessRef, inputRefs)}>
              <Label>Filter by Thickness</Label>
              <Select value={selectedThickness} onValueChange={setSelectedThickness}>
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

            <div className="flex-1 space-y-2" ref={productRef} tabIndex={-1} onKeyDown={(e) => handleArrowKey(e, productRef, inputRefs)}>
              <Label>Product</Label>
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Product" />
                </SelectTrigger>
                <SelectContent>
                  {filteredProducts.map((p) => (
                    <SelectItem key={p._id} value={p._id}>
                      {p.thickness} - {p.height} - {p.color}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2" ref={partyRef} tabIndex={-1} onKeyDown={(e) => handleArrowKey(e, partyRef, inputRefs)}>
              <Label>Party</Label>
              <Select value={selectedParty} onValueChange={setSelectedParty}>
                <SelectTrigger className="w-full truncate">
                  <SelectValue placeholder="Select Party" />
                </SelectTrigger>
                <SelectContent>
                  {parties.map((party) => (
                    <SelectItem key={party._id} value={party._id}>
                      {party.name} ({party.type})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Row 2 */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 space-y-2" ref={quantityRef} tabIndex={-1} onKeyDown={(e) => handleArrowKey(e, quantityRef, inputRefs)}>
              <Label>Quantity</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min={0}
                placeholder="Enter quantity"
                required
              />
            </div>

            <div className="flex-1 space-y-2" ref={typeRef} tabIndex={-1} onKeyDown={(e) => handleArrowKey(e, typeRef, inputRefs)}>
              <Label>Type</Label>
              <Select value={type} onValueChange={(val) => setType(val as "IN" | "OUT")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="IN">IN</SelectItem>
                  <SelectItem value="OUT">OUT</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-2" ref={dateRef} tabIndex={-1} onKeyDown={(e) => handleArrowKey(e, dateRef, inputRefs)}>
              <Label>Date</Label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Note */}
          <div className="space-y-2" ref={noteRef} tabIndex={-1} onKeyDown={(e) => handleArrowKey(e, noteRef, inputRefs)}>
            <Label>Note (Optional)</Label>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Write a note"
              className="w-full resize-y rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />
          </div>

          <Button type="submit" className="w-full">
            Add Entry
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
