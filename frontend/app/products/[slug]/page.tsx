import { notFound } from "next/navigation";
import { ProductDetail } from "./_components/ProductDetail";
import { getProductBySlug } from "@/services/productServices";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await getProductBySlug(slug);

  if (!product) {
    return notFound();
  }

  return <ProductDetail productDetail={product} />;
}
