import type { Product, ProductDetail } from "@/types/product";
import { multiColorProductDetail, featuredProducts } from "@/dummyData/product";

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  // Dummy implementation for fetching product data by slug
  if (!slug) return null;
  const returnData: ProductDetail = multiColorProductDetail;

  // Sleep 2 sec
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const res = await Promise.resolve({
    ok: true,
    json: async () => returnData,
  });

  if (!res.ok) return null;
  return res.json();
}

export async function getFeaturedProducts(): Promise<Product[]> {
  return featuredProducts;
}
