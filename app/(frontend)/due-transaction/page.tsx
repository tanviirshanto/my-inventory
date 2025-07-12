"use client";

import AddDueTransactionForm from "@/components/DueTransaction/AddDueTransactionForm";
import DueTransactionList from "@/components/DueTransaction/DueTransactionList";
import { useState } from "react";
import Link from "next/link";

export default function DueTransactionPage() {
  const [reloadKey, setReloadKey] = useState(0);

  const handleReload = () => setReloadKey((k) => k + 1);

  return (
    <main className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between my-10 "><h1 className="text-2xl font-bold ">Manage Due transactions</h1> <Link href='/due-transaction/summary' className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"> Summary </Link>
      </div> 
      <div className="flex flex-col lg:flex-row gap-5">
        <AddDueTransactionForm onAdded={handleReload} />
        <DueTransactionList key={reloadKey} />
      </div>
    </main>
  );
}
