import GroupedProductsForm from "@/components/Product/GroupProductsForm";
import GroupedProductsList from "@/components/Product/GroupedProductsList";
import Link from "next/link";

export default function GroupedProductsPage() {
  return (
    <main className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between  my-10"><h1 className="text-2xl font-bold">Manage Group Products</h1> <Link href='/product' className="text-blue-500 hover:text-blue-700 cursor-pointer"> All Products </Link>
      </div>
      <div className="flex gap-5">
        <GroupedProductsForm />
        <GroupedProductsList />
      </div>
    </main>
  );
}
