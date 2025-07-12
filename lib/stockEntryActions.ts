// lib/stockEntryActions.ts
export async function fetchStockEntries() {
  const res = await fetch("/api/stock-entry");
  if (!res.ok) throw new Error("Failed to fetch stock entries");
  return res.json();
}

export async function createStockEntry(data: {
  product: string;
  quantity: number;
  party: string;
  type: "IN" | "OUT";
  date?: string;
  note?: string;
}) {
  const res = await fetch("/api/stock-entry", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to create stock entry");
  }

  return res.json();
}

export async function updateStockEntry(
  id: string,
  data: {
    quantity: number;
    party: string;
    type: "IN" | "OUT";
    date: string;
    note?: string;
  }
) {
  const res = await fetch("/api/stock-entry", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update stock entry");
  }
  return res.json();
}

export async function deleteStockEntry(id: string) {
  const res = await fetch("/api/stock-entry", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete stock entry");
  }
  return res.json();
}

export async function resetStockEntries() {
  const res = await fetch("/api/stock-entry", {
    method: "PUT",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to reset stock entries");
  }
  return res.json();
}

export async function fetchStockEntryGroups(filters = {}) {
  const params = new URLSearchParams(filters as any).toString();
  const res = await fetch(`/api/stock-entry/grouped?${params}`);
  if (!res.ok) throw new Error("Failed to fetch entries");
  return res.json();
}
