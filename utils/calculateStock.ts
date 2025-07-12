import { StockEntry } from "@/models/stockEntryModel";
import { Stock } from "@/models/stockModel";

/**
 * Recalculate stock: total IN - total OUT entries
 */
export async function calculateStock(productId: string) {
  const entries = await StockEntry.find({ product: productId });

  console.log("Calculating stock for product:", entries);

  const totalIn = entries
    .filter((e) => e.type === "IN")
    .reduce((acc, cur) => acc + cur.quantity, 0);

  const totalOut = entries
    .filter((e) => e.type === "OUT")
    .reduce((acc, cur) => acc + cur.quantity, 0);

  const foundStock = await Stock.findOne({ product: productId });

  console.log("Current stock:", foundStock);


  const quantity = foundStock.intialQuantity +totalIn - totalOut;

  console.log("Calculated quantity:", quantity);

  await Stock.findOneAndUpdate(
    { product: productId },
    {
      quantity,
      lastUpdated: new Date(),
    },
    { upsert: true }
  );
}
