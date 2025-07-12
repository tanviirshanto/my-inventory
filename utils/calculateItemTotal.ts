interface PriceParams {
  thickness: number;
  height: number;
  price: number;
  quantity: number;
}

export function calculateItemTotal({ thickness, height, price, quantity }: PriceParams): number {
  const group1 = [15, 20, 25, 30, 120, 130, 150, 170, 190, 200, 220, 240, 260];
  const group2 = [35, 42, 320, 340, 360];
  const group3 = [48, 64, 420, 510];

  console.log("Calculating item total with params:", {
    thickness,
    height,
    price,
    quantity,
  });

  const divisorMap: Record<string, Record<number, number>> = {
    group1: { 6: 282, 7: 241, 8: 211, 9: 188, 10: 169, 11: 153, 12: 141 },
    group2: { 6: 224, 7: 192, 8: 168, 9: 149, 10: 134, 11: 122, 12: 112 },
    group3: { 6: 175, 7: 150, 8: 131, 9: 117, 10: 105, 11: 95, 12: 87 },
  };

  let divisor = 1; // fallback

  if (group1.includes(thickness)) {
    divisor = divisorMap.group1[height] || 1;
  } else if (group2.includes(thickness)) {
    divisor = divisorMap.group2[height] || 1;
  } else if (group3.includes(thickness)) {
    divisor = divisorMap.group3[height] || 1;
  }

  const pricePerPiece = price / divisor;
  return Math.round(pricePerPiece * quantity);
}
