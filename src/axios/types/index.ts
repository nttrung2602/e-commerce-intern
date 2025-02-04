export * from "./requestTypes";
export * from "./responseTypes";

export interface Category {
  id?: string;
  name?: string;
}

export interface Product {
  id: string;
  name: string;
  urlName?: string;
  picture?: any;
  basePrice: number;
  discountPercentage: number;
  stock: number;
  description: string;
  createdAt?: string;
  categories: Category[];
}

export type ProductFormData = Omit<
  Product,
  "urlName" | "picture" | "createdAt" | "id"
>;
