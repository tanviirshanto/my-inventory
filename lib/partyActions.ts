export async function fetchParties(filter = "ALL", page = 1, limit = 5, search = "") {
  const query = new URLSearchParams();
  if (filter !== "ALL") query.append("type", filter);
  query.append("page", page.toString());
  query.append("limit", limit.toString());
  if (search.trim()) query.append("search", search.trim());

  const res = await fetch(`/api/party/get?${query}`);
  if (!res.ok) throw new Error("Failed to fetch parties");

  return res.json();
}

export async function addParty(data: {
  name: string;
  type: string;
  phone?: string;
  email?: string;
  address?: string;
}) {
  const res = await fetch("/api/party/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function editParty(id: string, data: any) {
  const res = await fetch(`/api/party/edit/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteParty(id: string) {
  const res = await fetch(`/api/party/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete");
  return res.json();
}

export async function resetParties() {
  const res = await fetch("/api/party/reset", {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to reset parties");
  return res.json();
}
