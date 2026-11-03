export type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  slug: string;
  image?: string;
  category: string;
};

type ProductDetailBase = Omit<Product, "image"> & {
  make: "handmade" | "machine-made";
  details: [string, string][];
};

type ColorInfo = {
  name: string;
  hex: string;
};

type ColorImage = {
  color: string;
  url: string;
};

type ColorImages = {
  color: string;
  urls: string[];
};

type StockInfo = {
  color: string;
  quantity: number;
};

export type SingleColorProductDetail = ProductDetailBase & {
  colors: ColorInfo | null;
  image: string;
  other_images: string[];
  stock: number;
};

export type MultiColorProductDetail = ProductDetailBase & {
  colors: ColorInfo[];
  image: ColorImage[];
  other_images: ColorImages[];
  stock: StockInfo[];
};

export type ProductDetail = SingleColorProductDetail | MultiColorProductDetail;
