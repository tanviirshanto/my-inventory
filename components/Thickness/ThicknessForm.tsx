"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { addThickness } from "@/lib/thicknessActions";

interface ThicknessFormProps {
  onAdded: () => void;
}

export default function ThicknessForm({ onAdded }: ThicknessFormProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!name.trim()) {
      toast.error("Thickness name required");
      return;
    }
    setLoading(true);
    try {
      await addThickness(name.trim());
      toast.success("Thickness added");
      setName("");
      onAdded();
    } catch {
      toast.error("Failed to add thickness");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mt-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Enter new thickness"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-3 py-1 rounded flex-1"
        disabled={loading}
      />
      <button
        onClick={handleAdd}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
}
