export async function fetchHeights(): Promise<{ _id: string; name: string }[]> {
  const res = await fetch("/api/height/get", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch heights");
  return res.json();
}

export async function addHeight(name: string) {
  const res = await fetch("/api/height/add", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteHeight(id: string) {
  const res = await fetch(`/api/height/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete height");
  return res.json();
}

export async function resetHeights() {
  const res = await fetch("/api/height/reset", {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to reset heights");
  return res.json();
}

export async function editHeight(id: string, name: string) {
  const res = await fetch(`/api/height/edit/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to edit height");
  return res.json();
}
