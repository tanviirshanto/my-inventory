"use client";

import {
  fetchGroupedProducts,
  updateGroupedPrice,
  ProductGroup,
  deleteGroupedProducts,
} from "@/lib/productGroupedActions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function GroupedProductsList() {
  const [groups, setGroups] = useState<ProductGroup[]>([]);
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

  const totalPages = Math.ceil(groups.length / itemsPerPage);
  const paginatedGroups = groups.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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

  return (
    <div className="max-w-xl mx-auto mt-6">
      <h2 className="text-2xl font-semibold mb-6">Grouped Products</h2>

      {groups.length === 0 ? (
        <p className="text-gray-500 text-center">No groups found.</p>
      ) : (
        <>
          <table className="w-full border border-gray-300 text-center text-sm rounded overflow-hidden">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">Thickness</th>
                <th className="px-4 py-2 border">Party</th>
                <th className="px-4 py-2 border">Buying Price</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedGroups.map((group) => {
                const rowId = group.party._id + group.thickness;
                return (
                  <tr key={rowId} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{group.thickness}</td>
                    <td className="px-4 py-2 border">{group.party.name}</td>
                    <td className="px-4 py-2 border">
                      {editingId === rowId ? (
                        <input
                          type="number"
                          value={newPrice ?? group.buyingPrice}
                          onChange={(e) =>
                            setNewPrice(Number(e.target.value))
                          }
                          className="w-full border rounded px-2 py-1"
                        />
                      ) : (
                        group.buyingPrice
                      )}
                    </td>
                    <td className="px-4 py-2 border">
                      {editingId === rowId ? (
                        <button
                          className="text-green-600 hover:underline"
                          onClick={() => handleSave(group)}
                        >
                          Save
                        </button>
                      ) : (
                        <>
                          <button
                            className="text-blue-600 hover:underline"
                            onClick={() => {
                              setEditingId(rowId);
                              setNewPrice(group.buyingPrice);
                            }}
                          >
                            Edit
                          </button>
                          <button
                            className="text-red-600 ml-2 hover:underline"
                            onClick={() => handleDelete(group)}
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination controls */}
          <div className="mt-6 flex justify-center items-center gap-2 flex-wrap">
            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            })}

            <button
              className="px-3 py-1 border rounded disabled:opacity-50"
              onClick={() => setCurrentPage((prev) => prev + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
