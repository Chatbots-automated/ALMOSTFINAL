export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  sku: string;
  imageurl: string;  // Changed from 'image' to 'imageurl'
  variants?: {
    colors?: string[];
    sizes?: string[];
  };
  features?: string[];
}