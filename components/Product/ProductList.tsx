"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import {
  fetchProducts,
  deleteProduct,
  updateProduct,
  Product,
} from "@/lib/productActions";
import { fetchParties } from "@/lib/productActions";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [parties, setParties] = useState<{ _id: string; name: string }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Product>>({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortKey, setSortKey] = useState<keyof Product | "party.name">("thickness");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const loadData = async () => {
    try {
      const [products, parties] = await Promise.all([
        fetchProducts(),
        fetchParties(),
      ]);
      setProducts(products);
      setParties(parties);
    } catch {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered = products.filter((p) =>
    [p.thickness, p.height, p.color, p.party?.name]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    let aVal = sortKey === "party.name" ? a.party?.name : a[sortKey];
    let bVal = sortKey === "party.name" ? b.party?.name : b[sortKey];
    if (typeof aVal === "string") aVal = aVal.toLowerCase();
    if (typeof bVal === "string") bVal = bVal.toLowerCase();
    return aVal < bVal ? (sortOrder === "asc" ? -1 : 1) : aVal > bVal ? (sortOrder === "asc" ? 1 : -1) : 0;
  });

  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const currentItems = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const startEditing = (product: Product) => {
    setEditingId(product._id);
    setEditForm({
      thickness: product.thickness,
      height: product.height,
      color: product.color,
      buyingPrice: product.buyingPrice,
      party: product.party?._id,
    });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async () => {
    if (!editingId) return;
    try {
      await updateProduct(editingId, editForm);
      toast.success("Product updated");
      cancelEditing();
      loadData();
    } catch {
      toast.error("Failed to update product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Deleted");
      loadData();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const updateEditField = (field: keyof Product, value: any) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full mx-auto">
      <CardHeader>
        <CardTitle>Product List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center flex-wrap gap-2">
          <Input
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="max-w-sm"
          />
          <Select
            value={String(itemsPerPage)}
            onValueChange={(v) => {
              setItemsPerPage(Number(v));
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((n) => (
                <SelectItem key={n} value={String(n)}>
                  {n} per page
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              {["Thickness", "Height", "Color", "Buying Price", "Party"].map((label) => (
                <TableHead key={label}>{label}</TableHead>
              ))}
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentItems.map((p) => (
              <TableRow key={p._id}>
                {/* Inline editable fields */}
                <TableCell>
                  {editingId === p._id ? (
                    <Input
                      value={editForm.thickness || ""}
                      onChange={(e) => updateEditField("thickness", e.target.value)}
                    />
                  ) : (
                    p.thickness
                  )}
                </TableCell>
                <TableCell>
                  {editingId === p._id ? (
                    <Input
                      value={editForm.height || ""}
                      onChange={(e) => updateEditField("height", e.target.value)}
                    />
                  ) : (
                    p.height
                  )}
                </TableCell>
                <TableCell>
                  {editingId === p._id ? (
                    <Input
                      value={editForm.color || ""}
                      onChange={(e) => updateEditField("color", e.target.value)}
                    />
                  ) : (
                    p.color
                  )}
                </TableCell>
                <TableCell>
                  {editingId === p._id ? (
                    <Input
                      type="number"
                      value={editForm.buyingPrice?.toString() || ""}
                      onChange={(e) =>
                        updateEditField("buyingPrice", Number(e.target.value))
                      }
                    />
                  ) : (
                    p.buyingPrice
                  )}
                </TableCell>
                <TableCell>
                  {editingId === p._id ? (
                    <Select
                      value={String(editForm.party)}
                      onValueChange={(value) => updateEditField("party", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select party" />
                      </SelectTrigger>
                      <SelectContent>
                        {parties.map((pt) => (
                          <SelectItem key={pt._id} value={pt._id}>
                            {pt.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    p.party?.name || "-"
                  )}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  {editingId === p._id ? (
                    <>
                      <Button size="sm" onClick={saveEdit}>
                        Save
                      </Button>
                      <Button variant="outline" size="sm" onClick={cancelEditing}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button variant="outline" size="sm" onClick={() => startEditing(p)}>
                        Edit
                      </Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(p._id)}>
                        Delete
                      </Button>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4 flex-wrap">
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <Button
                key={num}
                size="sm"
                variant={currentPage === num ? "default" : "outline"}
                onClick={() => setCurrentPage(num)}
              >
                {num}
              </Button>
            ))}
            <Button
              size="sm"
              variant="outline"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
