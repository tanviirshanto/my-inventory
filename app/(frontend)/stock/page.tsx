import StockForm from "@/components/Stock/StockForm";
import StockList from "@/components/Stock/StockList";
import Link from "next/link";

export default function StockManagementPage() {
  return (
    <main className="max-w-5xl mx-auto p-4">
      <div className="flex justify-between my-10 items-center">
        <h1 className="text-2xl font-bold">Manage Stocks</h1>
        <Link href="/product" className="text-blue-500 hover:text-blue-700 cursor-pointer">
          All Products
        </Link>
      </div>
      <div className="flex gap-5">
        <div className="flex-1">
          <StockForm />
        </div>
        <div className="flex-1">
          <StockList />
        </div>
      </div>
    </main>
  );
}
