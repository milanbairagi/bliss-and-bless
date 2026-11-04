import Link from "next/link";
import { Suspense } from "react";
import { ProductCard } from "@/components/common/ProductCard";
import { getProducts } from "@/services/productServices";

const categories = [
  { value: "bracelet", label: "Bracelets" },
  { value: "bead", label: "Beads" },
  { value: "scarf", label: "Scarves" },
  { value: "glove", label: "Gloves" },
];

export default function ProductsPage({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string | string[] }>;
}) {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsPageContent searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductsPageContent({
  searchParams,
}: {
  searchParams?: Promise<{ category?: string | string[] }>;
}) {
  const params = (await searchParams) ?? {};
  const categoryParam = Array.isArray(params.category)
    ? params.category[0]
    : params.category;
  const selectedCategory = categoryParam?.toLowerCase() ?? "all";
  const visibleProducts = await getProducts(selectedCategory);
  const allProducts = await getProducts();
  const categoryCounts = await Promise.all(
    categories.map(async (category) => ({
      ...category,
      count: (await getProducts(category.value)).length,
    })),
  );
  const selectedCategoryKey =
    categories.find((category) => category.value === selectedCategory)?.value ??
    (selectedCategory === "scarves" ? "scarf" : selectedCategory);
  const selectedCategoryLabel =
    categories.find((category) => category.value === selectedCategoryKey)
      ?.label ?? "Shop all";

  return (
    <main>
      <section className="flex-col gap-6 px-5 pb-18 pt-10 mx-auto max-w-300 min-[721px]:px-8 flex">
        <div className="text-[15px] text-muted">
          <Link href="/">Home</Link> / <span>Shop</span>
        </div>

        <div className="flex-wrap gap-3 justify-between flex items-end">
          <h1 className="m-0 font-display text-5xl font-bold leading-tight">
            {selectedCategoryLabel}
          </h1>
          <p className="m-0 text-muted" role="status">
            Showing {visibleProducts.length} products
          </p>
        </div>

        <div
          className="flex-wrap gap-2 flex"
          role="group"
          aria-label="Filter by category"
        >
          <Link
            className={`grid place-items-center min-h-11 rounded-full border-2 border-ink px-5.5 font-bold ${
              selectedCategory === "all"
                ? "bg-ink text-cream"
                : "bg-white text-ink"
            }`}
            aria-pressed={selectedCategory === "all"}
            href="/products"
            aria-label={`Show all products (${allProducts.length})`}
          >
            All ({allProducts.length})
          </Link>
          {categoryCounts.map((category) => {
            const isSelected = selectedCategoryKey === category.value;

            return (
              <Link
                className={`grid place-items-center min-h-11 rounded-full border-2 border-ink px-5.5 font-bold ${
                  isSelected ? "bg-ink text-cream" : "bg-white text-ink"
                }`}
                aria-pressed={isSelected}
                key={category.value}
                href={`/products?category=${category.value}`}
              >
                {category.label} ({category.count})
              </Link>
            );
          })}
        </div>

        <div className="grid grid-cols-[repeat(auto-fill,minmax(16rem,1fr))] gap-6">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} catalog />
          ))}
        </div>
      </section>
    </main>
  );
}

function ProductsPageSkeleton() {
  return (
    <main>
      <section className="flex-col gap-6 px-5 pb-18 pt-10 mx-auto max-w-300 min-[721px]:px-8 flex">
        <div className="h-5 w-24 rounded-full bg-[#f2d7cf] animate-pulse" />
        <div className="h-12 w-56 rounded-full bg-[#f2d7cf] animate-pulse" />
        <div className="flex-wrap gap-2 flex">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              className="h-11 w-28 rounded-full bg-[#f2d7cf] animate-pulse"
              key={index}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
