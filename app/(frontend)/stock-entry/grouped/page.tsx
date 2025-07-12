import StockEntryGrouped from "@/components/Stock-Entry/Grouped/StockEntryGrouped";



export default function StockEntryPage() {
  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-8">View Stock Entries</h1>
      <div className="flex flex-col gap-6">
        <StockEntryGrouped  />
      </div>
    </main>
  );
}
