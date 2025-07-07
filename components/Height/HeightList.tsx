"use client";

import { useEffect, useState } from "react";
import {
  fetchHeights,
  deleteHeight,
  resetHeights,
  editHeight,
} from "@/lib/heightActions";

export default function HeightList({ refresh }: { refresh: boolean }) {
  const [heights, setHeights] = useState<{ _id: string; name: string }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const loadHeights = async () => {
    const data = await fetchHeights();
    setHeights(data);
  };

  useEffect(() => {
    loadHeights();
  }, [refresh]); 

  const handleDelete = async (id: string) => {
    await deleteHeight(id);
    loadHeights();
  };

  const handleReset = async () => {
    if (confirm("Are you sure?")) {
      await resetHeights();
      loadHeights();
    }
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (editingId && editValue.trim()) {
      await editHeight(editingId, editValue.trim());
      cancelEdit();
      loadHeights();
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <button
        onClick={handleReset}
        className="text-sm text-red-500 hover:underline"
      >
        Reset All
      </button>

      {heights.length === 0 ? (
        <p className="text-gray-500">No heights found.</p>
      ) : (
        <ul className="space-y-2">
          {heights.map((h) => (
            <li
              key={h._id}
              className="flex justify-between items-center border px-4 py-2 rounded"
            >
              {editingId === h._id ? (
                <div className="flex gap-2 w-full">
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") saveEdit();
                      if (e.key === "Escape") cancelEdit();
                    }}
                    className="border px-2 py-1 rounded flex-1"
                    autoFocus
                  />
                  <button
                    onClick={saveEdit}
                    className="text-green-600 text-sm hover:underline"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-500 text-sm hover:underline"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span
                    onClick={() => startEdit(h._id, h.name)}
                    className="cursor-pointer text-blue-600 hover:underline flex-1"
                  >
                    {h.name}
                  </span>
                  <button
                    onClick={() => handleDelete(h._id)}
                    className="text-red-500 hover:underline text-sm"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
