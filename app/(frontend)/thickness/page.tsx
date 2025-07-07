"use client";

import { useState } from "react";
import ThicknessForm from "@/components/Thickness/ThicknessForm";
import ThicknessList from "@/components/Thickness/ThicknessList";

export default function ThicknessPage() {
  const [refresh, setRefresh] = useState(false);

  return (
    <main className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Manage Thicknesses</h1>
      <ThicknessForm onAdded={() => setRefresh((prev) => !prev)} />
      <ThicknessList key={refresh ? "r1" : "r0"} />
    </main>
  );
}
