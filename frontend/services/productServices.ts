import type { Product, ProductDetail } from "@/types/product";
import { API_BASE_URL } from "@/constants";

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  if (!slug) return null;

  const response = await fetch(`${API_BASE_URL}/api/products/${slug}`);

  if (!response.ok) {
    console.error(`Failed to fetch product with slug: ${slug}`);
    return null;
  }

  const data: ProductDetail = await response.json();
  return data;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const response = await fetch(`${API_BASE_URL}/api/products/?featured=true`);
  if (!response.ok) {
    console.error("Failed to fetch featured products");
    return [];
  }

  const data: Product[] = await response.json();
  return data;
}

export async function getProducts(category = "all"): Promise<Product[]> {
  const normalizedCategory = category.trim().toLowerCase();

  const response = await fetch(
    `${API_BASE_URL}/api/products/?category=${normalizedCategory}`,
  );

  if (!response.ok) {
    console.error("Failed to fetch products");
    return [];
  }

  const data: Product[] = await response.json();
  console.log("Fetched products:", data);
  return data;
}
