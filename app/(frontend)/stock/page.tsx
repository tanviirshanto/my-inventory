import StockForm from "@/components/Stock/StockForm";
import StockList from "@/components/Stock/StockList";
import Link from "next/link";

export default function StockManagementPage() {
  return (
     <main className="max-w-5xl mx-auto px-4 py-6">
      
      <div className="flex justify-between items-baseline"><h1 className="text-2xl font-bold ">Manage Stock Entries</h1>
      <Link href="/product">View all products</Link>
        </div>
      <div className="flex flex-col gap-10">
        <StockForm />
        <StockList />
      </div>
    </main>
  );
}
