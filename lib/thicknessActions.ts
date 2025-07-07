export async function fetchThicknesses(): Promise<{ _id: string; name: string }[]> {
  const res = await fetch("/api/thickness/get", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch thicknesses");
  return res.json();
}

export async function addThickness(name: string) {
  const res = await fetch("/api/thickness/add", {
    method: "POST",
    body: JSON.stringify({ name }),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function editThickness(id: string, name: string) {
  const res = await fetch(`/api/thickness/edit/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteThickness(id: string) {
  const res = await fetch(`/api/thickness/delete/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function resetThicknesses() {
  const res = await fetch("/api/thickness/reset", { method: "DELETE" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
