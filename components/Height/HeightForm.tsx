"use client";

import { useState } from "react";
import { addHeight } from "@/lib/heightActions";
import toast from "react-hot-toast";

interface HeightFormProps {
  onAdded: () => void;
}

export default function HeightForm({ onAdded }: HeightFormProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async (e:unknown) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Height name required");
      return;
    }

    setLoading(true);
    try {
      await addHeight(name.trim());
      toast.success("Height added");
      setName("");
      onAdded(); // Refresh height list
    } catch (err: any) {
      toast.error(err.message || "Failed to add");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2 mt-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter new height"
        className="border px-3 py-1 rounded flex-1"
      />
      <button
        onClick={(e)=>handleAdd(e)}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-1 rounded disabled:opacity-50"
      >
        {loading ? "Adding..." : "Add"}
      </button>
    </div>
  );
}
