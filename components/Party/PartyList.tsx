"use client";

import { useEffect, useState } from "react";
import {
  deleteParty,
  editParty,
  fetchParties,
  resetParties,
} from "@/lib/partyActions";
import toast from "react-hot-toast";

export default function PartyList() {
  const [parties, setParties] = useState<any[]>([]);
  const [filter, setFilter] = useState<"ALL" | "CUSTOMER" | "SUPPLIER">("ALL");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const loadParties = async () => {
    try {
      const res = await fetchParties(filter, page, 5, search);
      setParties(res.data);
      setTotalPages(res.totalPages);
    } catch {
      toast.error("Failed to fetch parties");
    }
  };

  useEffect(() => {
    loadParties();
  }, [filter,page,parties]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      loadParties();
    }, 300);
    return () => clearTimeout(timeout);
  }, [search]);

  const handleEdit = (party: any) => {
    setEditingId(party._id);
    setForm({
      name: party.name,
      phone: party.phone,
      email: party.email,
      address: party.address,
    });
  };

  const handleSave = async () => {
    if (!editingId) return;

    try {
      await editParty(editingId, form);
      toast.success("Updated");
      setEditingId(null);
      loadParties();
    } catch {
      toast.error("Update failed");
    }
  };

  const handleReset = async () => {
    if (confirm("Are you sure?")) {
      await resetParties();
      loadParties();
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-2 py-1 rounded text-sm w-full"
        />
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value as any)}
          className="border px-2 py-1 rounded text-sm"
        >
          <option value="ALL">All</option>
          <option value="CUSTOMER">Customers</option>
          <option value="SUPPLIER">Suppliers</option>
        </select>
        <button
          onClick={handleReset}
          className="text-red-600 text-sm hover:underline"
        >
          Reset All
        </button>
      </div>

      {parties.length === 0 ? (
        <p className="text-gray-500">No parties found.</p>
      ) : (
        <ul className="space-y-2">
          {parties.map((party) => (
            <li key={party._id} className="border rounded p-2">
              {editingId === party._id ? (
                <div className="space-y-1">
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    className="border w-full px-2 py-1 rounded"
                  />
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    className="border w-full px-2 py-1 rounded"
                  />
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    className="border w-full px-2 py-1 rounded"
                  />
                  <input
                    value={form.address}
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
                    className="border w-full px-2 py-1 rounded"
                  />
                  <button
                    onClick={handleSave}
                    className="text-green-600 text-sm mr-2"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-500 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold">
                      {party.name} ({party.type})
                    </p>
                    <p className="text-sm text-gray-700">
                      {party.phone} | {party.email}
                    </p>
                    <p className="text-sm text-gray-600">{party.address}</p>
                  </div>
                  <div className="flex gap-2 text-sm mt-1">
                    <button
                      onClick={() => handleEdit(party)}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={async () => {
                        await deleteParty(party._id);
                        toast.success("Deleted");
                        loadParties();
                      }}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Prev
          </button>
          <span className="px-3 py-1 text-sm">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
