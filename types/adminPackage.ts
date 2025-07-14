export interface AdminPackage {
  id: string;
  name: string;
  description: string;
  price: number; // Price in LKR (as a number for calculations)
  priceDisplay: string; // Formatted price display (e.g., "LKR 990/month")
  features: string[];
}
