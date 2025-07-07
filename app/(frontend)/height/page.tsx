"use client";

import HeightForm from "@/components/Height/HeightForm";
import HeightList from "@/components/Height/HeightList";
import { useState } from "react";

export default function HeightPage() {
  const [refresh, setRefresh] = useState(false);
  return (
    <main className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Manage Heights</h1>
      <HeightForm onAdded={() => window.location.reload()} />
      <HeightList refresh={refresh} />
    </main>
  );
}
