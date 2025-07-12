"use client";

import { useEffect, useState } from "react";
import {
  fetchGroupedProducts,
  updateGroupedPrice,
  deleteGroupedProducts,
  ProductGroup,
} from "@/lib/productGroupedActions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import toast from "react-hot-toast";

export default function GroupedProductsList() {
  const [groups, setGroups] = useState<ProductGroup[]>([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newPrice, setNewPrice] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    async function load() {
      try {
        const data = await fetchGroupedProducts();
        setGroups(data);
      } catch {
        toast.error("Failed to load grouped products");
      }
    }
    load();
  }, []);

  const handleSave = async (group: ProductGroup) => {
    if (newPrice === null || isNaN(newPrice)) {
      toast.error("Enter valid price");
      return;
    }

    try {
      await updateGroupedPrice(group.products, newPrice);
      toast.success("Price updated");

      setGroups((prev) =>
        prev.map((g) =>
          g.products === group.products ? { ...g, buyingPrice: newPrice } : g
        )
      );

      setEditingId(null);
      setNewPrice(null);
    } catch {
      toast.error("Failed to update price");
    }
  };

  const handleDelete = async (group: ProductGroup) => {
    const confirmed = confirm("Are you sure you want to delete this group?");
    if (!confirmed) return;

    try {
      await deleteGroupedProducts(group.products);
      toast.success("Group deleted");
      setGroups((prev) =>
        prev.filter(
          (g) =>
            g.thickness !== group.thickness || g.party._id !== group.party._id
        )
      );
    } catch {
      toast.error("Failed to delete group");
    }
  };

  const filteredGroups = groups.filter((group) => {
    const term = search.toLowerCase();
    return (
      group.thickness.toLowerCase().includes(term) ||
      group.party.name.toLowerCase().includes(term)
    );
  });

  const totalPages = Math.ceil(filteredGroups.length / itemsPerPage);
  const paginatedGroups = filteredGroups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="max-w-6xl mx-auto py-10 space-y-6">
      <h2 className="text-2xl font-semibold">Grouped Products</h2>

      <Input
        placeholder="Search by thickness or party"
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          setCurrentPage(1);
        }}
        className="max-w-sm"
      />

      {filteredGroups.length === 0 ? (
        <p className="text-center text-muted-foreground mt-4">
          No matching groups found.
        </p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thickness</TableHead>
                <TableHead>Party</TableHead>
                <TableHead>Buying Price</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGroups.map((group) => {
                const rowId = group.party._id + group.thickness;

                return (
                  <TableRow key={rowId}>
                    <TableCell>{group.thickness}</TableCell>
                    <TableCell>{group.party.name}</TableCell>
                    <TableCell>
                      {editingId === rowId ? (
                        <Input
                          type="number"
                          value={newPrice ?? group.buyingPrice}
                          onChange={(e) =>
                            setNewPrice(Number(e.target.value))
                          }
                        />
                      ) : (
                        group.buyingPrice
                      )}
                    </TableCell>
                    <TableCell className="space-x-2">
                      {editingId === rowId ? (
                        <Button
                          size="sm"
                          onClick={() => handleSave(group)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          Save
                        </Button>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setEditingId(rowId);
                              setNewPrice(group.buyingPrice);
                            }}
                          >
                            Edit
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(group)}
                          >
                            Delete
                          </Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 flex-wrap mt-6">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </Button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={page === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
