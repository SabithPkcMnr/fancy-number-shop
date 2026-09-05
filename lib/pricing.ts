export function sellingFrom(originalPrice: number, discount: number, sellingPrice?: number) {
  if (sellingPrice && sellingPrice > 0) return Math.round(sellingPrice);
  return Math.round(originalPrice * (1 - (discount || 0) / 100));
}

export function discountFrom(originalPrice: number, sellingPrice: number) {
  if (!originalPrice || sellingPrice >= originalPrice) return 0;
  return Math.max(0, Math.round((1 - sellingPrice / originalPrice) * 100));
}

export function marginFrom(sellingPrice: number, dealerPrice?: number) {
  if (!dealerPrice) return undefined;
  return sellingPrice - dealerPrice;
}
