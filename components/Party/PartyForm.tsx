"use client";

import { useEffect, useState } from "react";
import { addParty } from "@/lib/partyActions";
import toast from "react-hot-toast";


export default function PartyForm() {
  const [form, setForm] = useState({
    name: "",
    type: "CUSTOMER",
    phone: "",
    email: "",
    address: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name || !form.type) {
      toast.error("Name and Type are required");
      return;
    }

    try {
      await addParty(form);
      toast.success("Party added");
      setForm({ name: "", type: "CUSTOMER", phone: "", email: "", address: "" });
      
    } catch (err: any) {
      toast.error(err.message);
    }
  };



  return (
    <div className="space-y-2 mb-4">
      <div className="flex gap-2">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Party name"
          className="border px-3 py-1 rounded w-full"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="border px-3 py-1 rounded"
        >
          <option value="CUSTOMER">Customer</option>
          <option value="SUPPLIER">Supplier</option>
        </select>
      </div>
      <input
        name="phone"
        value={form.phone}
        onChange={handleChange}
        placeholder="Phone"
        className="border px-3 py-1 rounded w-full"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
        className="border px-3 py-1 rounded w-full"
      />
      <input
        name="address"
        value={form.address}
        onChange={handleChange}
        placeholder="Address"
        className="border px-3 py-1 rounded w-full"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-1 rounded"
      >
        Add
      </button>
    </div>
  );
}
