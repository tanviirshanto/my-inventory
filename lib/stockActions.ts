// lib/stockActions.ts

export type Stock = {
  _id: string;
  product: string; // product id
  quantity: number;
  intialQuantity: number;
  lastUpdated: string;
};

export async function fetchStocks({ page = 1, q = "" }) {
  const params = new URLSearchParams({ page: page + "", limit: "10" });
  if (q.trim()) params.set("q", q.trim());
  const res = await fetch(`/api/stock?${params}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Error fetching stocks");
  return res.json();
}

export async function addStock(stockData: {
  product: string;
  quantity?: number;
  intialQuantity?: number;
}): Promise<Stock> {
  const res = await fetch("/api/stock", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(stockData),
  });
  if (!res.ok) throw new Error("Failed to add stock");
  return res.json();
}

export async function editStock(stockId: string, quantity: number, initialQuantity: number) {
  const res = await fetch(`/api/stock`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stockId, quantity, initialQuantity }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}


export async function deleteStock(id: string): Promise<{ message: string }> {
  const res = await fetch(`/api/stock/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete stock");
  return res.json();
}

export async function resetStock(): Promise<{ message: string }> {
  const res = await fetch("/api/stock", {
    method: "PUT",
  });
  if (!res.ok) throw new Error("Failed to reset stocks");
  return res.json();
}
