export interface Product {
  id: number;
  name: string;
  origin: string;
  category: string;
  roast: string;
  price: number;
  weight: string;
  description: string;
  flavorNotes: string[];
  image: string;
  rating: number;
}

export interface CartItem {
  product: Product;
  quantity: number;
}
