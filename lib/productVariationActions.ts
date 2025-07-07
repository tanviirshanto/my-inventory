export type Product = {
  _id: string;
  thickness: string;
  height: string;
  color: string;
  buyingPrice: number;
  party: { _id: string; name: string };
};

export async function fetchProductVariations(): Promise<Product[]> {
  const res = await fetch("/api/product/variations", { cache: "no-store" });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
