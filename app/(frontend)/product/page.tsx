"use client";

import AddProductForm from "@/components/Product/AddProductForm";
import ProductList from "@/components/Product/ProductList";
import Link from "next/link";
import { useState } from "react";

export default function ProductPage() {
  const [reloadKey, setReloadKey] = useState(0);

  const handleReload = () => setReloadKey((k) => k + 1);

  return (
    <main className="max-w-5xl mx-auto p-4">
     <div className="flex justify-between my-10 "><h1 className="text-2xl font-bold ">Manage Products</h1> <Link href='/product/grouped' className="text-blue-500 hover:text-blue-700 hover:underline cursor-pointer"> Grouped Products </Link>
      </div> 
      <div className="flex gap-5">
        <AddProductForm onAdded={handleReload} />
        <ProductList key={reloadKey} />
      </div>
    </main>
  );
}
