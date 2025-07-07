"use client";

import ColorForm from "@/components/Color/ColorForm";
import ColorList from "@/components/Color/ColorList";

export default function ColorPage() {
  return (
    <main className="max-w-md mx-auto py-10 px-4">
      <h1 className="text-2xl font-bold mb-4">Manage Colors</h1>
      <ColorForm onAdd={() => window.location.reload()} />
      <ColorList />
    </main>
  );
}
