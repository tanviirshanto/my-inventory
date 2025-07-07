"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchProducts, deleteProduct, Product } from "@/lib/productActions";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure to delete this product?")) return;
    try {
      await deleteProduct(id);
      toast.success("Deleted");
      loadProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (products.length === 0) return <p>No products found.</p>;

  return (
    <table className="w-full border-collapse border border-gray-300">
      <thead>
        <tr className="bg-gray-100">
          <th className="border border-gray-300 px-3 py-1">Thickness</th>
          <th className="border border-gray-300 px-3 py-1">Height</th>
          <th className="border border-gray-300 px-3 py-1">Color</th>
          <th className="border border-gray-300 px-3 py-1">Buying Price</th>
          <th className="border border-gray-300 px-3 py-1">Party</th>
          <th className="border border-gray-300 px-3 py-1">Actions</th>
        </tr>
      </thead>
      <tbody>
        {products.map(({ _id, thickness, height, color, buyingPrice, party }) => (
          <tr key={_id}>
            <td className="border border-gray-300 px-3 py-1">{thickness}</td>
            <td className="border border-gray-300 px-3 py-1">{height}</td>
            <td className="border border-gray-300 px-3 py-1">{color}</td>
            <td className="border border-gray-300 px-3 py-1">{buyingPrice}</td>
            <td className="border border-gray-300 px-3 py-1">{party.name}</td>
            <td className="border border-gray-300 px-3 py-1 text-center">
              <button
                className="text-red-600 hover:underline"
                onClick={() => handleDelete(_id)}
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
