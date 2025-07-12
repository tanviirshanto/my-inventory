// /lib/dueTransactionActions.ts
export async function fetchDueTransactions(page = 1, limit = 10) {
  const res = await fetch(`/api/due-transaction?page=${page}&limit=${limit}`);
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
}


export async function addDueTransaction(data) {
  const res = await fetch("/api/due-transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to add");
  return res.json();
}

export async function editDueTransactions(data) {
  const res = await fetch(`/api/due-transaction/${data._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update");
  return res.json();
}


export async function deleteDueTransaction(id) {
  const res = await fetch(`/api/due-transaction?id=${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
}

export async function resetDueTransactions() {
  const res = await fetch("/api/due-transaction/reset", {
    method: "DELETE", // 🔥 use DELETE, not POST
  });
  if (!res.ok) throw new Error("Reset failed");
  return res.json();
}

