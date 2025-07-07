"use client";

import PartyForm from "@/components/Party/PartyForm";
import PartyList from "@/components/Party/PartyList";

export default function PartyPage() {
  return (
    <main className="max-w-xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Manage Parties</h1>
      <PartyForm />
      <PartyList />
    </main>
  );
}
