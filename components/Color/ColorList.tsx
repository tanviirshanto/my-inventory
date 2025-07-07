"use client";

import { useEffect, useState } from "react";
import {
  fetchColors,
  deleteColor,
  resetColors,
  editColor,
} from "@/lib/colorActions";

export default function ColorList() {
  const [colors, setColors] = useState<{ _id: string; name: string }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  const loadColors = async () => {
    const data = await fetchColors();
    setColors(data);
  };

  useEffect(() => {
    loadColors();
  }, []);

  const handleDelete = async (id: string) => {
    await deleteColor(id);
    loadColors();
  };

  const handleReset = async () => {
    if (confirm("Are you sure?")) {
      await resetColors();
      loadColors();
    }
  };

  const startEdit = (id: string, name: string) => {
    console.log("Start editing:", id, name);
    setEditingId(id);
    setEditValue(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (editingId && editValue.trim()) {
      await editColor(editingId, editValue.trim());
      cancelEdit();
      loadColors();
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

      {colors.length === 0 ? (
        <p className="text-gray-500">No colors found.</p>
      ) : (
        <ul className="space-y-2">
          {colors.map((color) => (
            <li
              key={color._id}
              className="flex justify-between items-center border px-4 py-2 rounded"
            >
              {editingId === color._id ? (
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
                    className="text-green-600 text-sm hover:underline cursor-pointer"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="text-gray-500 text-sm hover:underline  cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <span
                    onClick={() => startEdit(color._id, color.name)}
                    className="cursor-pointer text-blue-600 hover:underline flex-1"
                  >
                    {color.name}
                  </span>
                  <button
                    onClick={() => handleDelete(color._id)}
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
