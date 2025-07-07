// lib/productGroupedActions.ts

export interface GroupedProductForm {
  thickness: string;
  party: string;
  buyingPrice: number;
  heights: string[];
  colors: string[];
}

export interface ProductGroup {
  thickness: string;
  party: { _id: string; name: string };
  buyingPrice: number;
  products: string[];
}

export async function addGroupedProducts(form: GroupedProductForm) {
  const res = await fetch("/api/product/grouped", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(form),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to add grouped products");
  }

  return res.json();
}

export async function fetchGroupedProducts(): Promise<ProductGroup[]> {
  const res = await fetch("/api/product/grouped", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to fetch grouped products");
  return res.json();
}

export async function updateGroupedPrice(ids: string[], buyingPrice: number) {
  const res = await fetch("/api/product/grouped", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids, buyingPrice }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update grouped price");
  }

  return res.json();
}


export async function deleteGroupedProducts(ids: string[]) {
  const res = await fetch("/api/product/grouped", {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete grouped products");
  }

  return res.json();
}
