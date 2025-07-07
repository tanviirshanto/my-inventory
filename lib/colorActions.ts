// lib/actions.ts
export async function addColor(name: string) {
  const res = await fetch("/api/color/add", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function editColor(id: string, name: string) {
  const res = await fetch(`/api/color/edit/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteColor(id: string) {
  const res = await fetch(`/api/color/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
}

export async function resetColors() {
  const res = await fetch("/api/color/reset", {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to reset");
  return res.json();
}

export async function fetchColors(): Promise<{ _id: string; name: string }[]> {
  const res = await fetch("/api/color/get", { cache: "no-store" }); // you’ll need to implement this
  if (!res.ok) throw new Error("Failed to load colors");
  return res.json();
}
