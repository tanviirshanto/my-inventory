import StockEntryForm from "@/components/Stock-Entry/StockEntryForm";
import StockEntryList from "@/components/Stock-Entry/StockEntryList";



export default function StockEntryPage() {
  return (
     <main className="max-w-5xl mx-auto px-4 py-6 space-y-8">
      <div className="flex flex-col justify-between items-center">
      <h1 className="text-2xl font-bold mb-8">Manage Stock Entries</h1>
      <div className="flex flex-col gap-6">
        <StockEntryForm />
        <StockEntryList />
      </div></div>
    </main>
  );
}
