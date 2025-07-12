"use client";

import PartyForm from "@/components/Party/PartyForm";
import PartyList from "@/components/Party/PartyList";

export default function PartyPage() {
  return (
    <main className="w-full mx-auto py-10 px-4">
      <h1 className=" text-2xl font-bold mb-4">Manage Parties</h1>
      <div className="flex gap-5">
        <PartyForm />
        <PartyList />
      </div>
    </main>
  );
}
