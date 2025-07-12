"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchProducts } from "@/lib/productActions";
import { addStock, resetStock } from "@/lib/stockActions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function StockForm() {
  const [products, setProducts] = useState([]);
  const [productId, setProductId] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);

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
    if (!productId) {
      toast.error("Please select a product");
      return;
    }

    try {
      setLoading(true);
      await addStock({ product: productId, quantity });
      toast.success("Stock added");
      setProductId("");
      setQuantity(0);
    } catch (err: any) {
      toast.error(err.message || "Failed to add stock");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    const confirmed = confirm("Are you sure you want to reset all stock?");
    if (!confirmed) return;

    try {
      await resetStock();
      toast.success("All stock reset");
    } catch {
      toast.error("Failed to reset stock");
    }
  };

  return (
    <Card className="w-full mx-auto mt-5 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl">Manage Stock</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Product Select */}
        <div className="space-y-1">
          <Label>Select Product</Label>
          <Select value={productId} onValueChange={setProductId}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a product" />
            </SelectTrigger>
            <SelectContent>
              {products.map((p) => (
                <SelectItem key={p._id} value={p._id}>
                  {`${p.thickness} - ${p.height} - ${p.color}`}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Quantity Input */}
        <div className="space-y-1">
          <Label htmlFor="quantity">Quantity</Label>
          <Input
            id="quantity"
            type="number"
            min={0}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
            placeholder="Enter quantity"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleAdd}
            className="flex-1"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add Stock"}
          </Button>
          
        </div>
      </CardContent>
    </Card>
  );
}
