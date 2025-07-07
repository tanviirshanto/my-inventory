"use client";

import { useEffect, useState } from "react";
import {
  fetchThicknesses,
  editThickness,
  deleteThickness,
  resetThicknesses,
} from "@/lib/thicknessActions";
import toast from "react-hot-toast";

export default function ThicknessList() {
  const [thicknesses, setThicknesses] = useState<{ _id: string; name: string }[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [loading, setLoading] = useState(false);

  const loadThicknesses = async () => {
    try {
      const data = await fetchThicknesses();
      setThicknesses(data);
    } catch {
      toast.error("Failed to load thicknesses");
    }
  };

  useEffect(() => {
    loadThicknesses();
  }, []);

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditValue("");
  };

  const saveEdit = async () => {
    if (!editValue.trim() || !editingId) return;
    setLoading(true);
    try {
      await editThickness(editingId, editValue.trim());
      toast.success("Thickness updated");
      cancelEdit();
      loadThicknesses();
    } catch {
      toast.error("Failed to update thickness");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this thickness?")) return;
    setLoading(true);
    try {
      await deleteThickness(id);
      toast.success("Thickness deleted");
      loadThicknesses();
    } catch {
      toast.error("Failed to delete thickness");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!confirm("Are you sure you want to delete all thicknesses?")) return;
    setLoading(true);
    try {
      await resetThicknesses();
      toast.success("All thicknesses reset");
      loadThicknesses();
    } catch {
      toast.error("Failed to reset thicknesses");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 px-4">
      <button
        onClick={handleReset}
        disabled={loading}
        className="text-red-600 text-sm mb-4 hover:underline disabled:opacity-50"
      >
        Reset All Thicknesses
      </button>

      {thicknesses.length === 0 ? (
        <p className="text-gray-500">No thicknesses found.</p>
      ) : (
        <ul className="space-y-2">
          {thicknesses.map(({ _id, name }) => (
            <li
              key={_id}
              className="flex justify-between items-center border rounded px-4 py-2"
            >
              {editingId === _id ? (
                <>
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    className="border rounded px-2 py-1 flex-1 mr-2"
                    disabled={loading}
                  />
                  <button
                    onClick={saveEdit}
                    disabled={loading}
                    className="text-green-600 text-sm hover:underline mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    disabled={loading}
                    className="text-gray-500 text-sm hover:underline"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <span
                    className="cursor-pointer flex-1"
                    onClick={() => startEdit(_id, name)}
                  >
                    {name}
                  </span>
                  <button
                    onClick={() => handleDelete(_id)}
                    disabled={loading}
                    className="text-red-600 text-sm hover:underline"
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
