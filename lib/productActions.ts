// lib/productActions.ts

export interface Product {
  _id: string;
  thickness: string;
  height: string;
  color: string;
  buyingPrice: number;
  party: string;
}

export async function fetchProducts(): Promise<Product[]> {
  const res = await fetch("/api/product/get", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function addProduct(data: {
  thickness: string;
  height: string;
  color: string;
  buyingPrice: number;
  party: string;
}) {
  const res = await fetch("/api/product/add", {
    method: "POST",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteProduct(id: string) {
  const res = await fetch(`/api/product/delete/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete product");
  return res.text();
}

export async function fetchThicknesses(): Promise<string[]> {
  const res = await fetch("/api/thickness/get", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch thicknesses");
  return res.json();
}

export async function fetchHeights(): Promise<string[]> {
  const res = await fetch("/api/height/get", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch heights");
  return res.json();
}

export async function fetchColors(): Promise<string[]> {
  const res = await fetch("/api/color/get", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch colors");
  return res.json();
}

export async function fetchParties(): Promise<{ _id: string; name: string }[]> {
  const res = await fetch("/api/party/get", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch parties");
  const json = await res.json();
  // json = { data: [...], totalPages: number }
  return json.data; // Return the array only
}

// /lib/productActions.ts
export async function updateProduct(id: string, updatedData: any) {
  const res = await fetch(`/api/product/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(updatedData),
  });
  if (!res.ok) throw new Error("Failed to update product");
}
