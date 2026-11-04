import Link from "next/link";
import type { Product } from "@/types/product";
import Image from "next/image";

// Temporary category styles for demonstration purposes when no product image is available.
const categoryStyles: Record<
  string,
  { tint: string; dot: string; label: string }
> = {
  bracelets: { tint: "bg-[#f7d9a8]", dot: "bg-red", label: "Bracelets" },
  beads: { tint: "bg-[#d9e6d3]", dot: "bg-[#e8a33d]", label: "Beads" },
  scarves: { tint: "bg-[#f2c6bf]", dot: "bg-red", label: "Scarves" },
  gloves: { tint: "bg-[#ebd0da]", dot: "bg-[#9c4a68]", label: "Gloves" },
};

export function ProductCard({
  product,
  catalog = false,
}: {
  product: Product;
  catalog?: boolean;
}) {
  const style = categoryStyles[product.category] ?? {
    tint: "bg-[#ebd0da]",
    dot: "bg-ink",
    label: product.category,
  };
  const tag = product.name.includes("Handmade")
    ? "Handmade"
    : product.name.includes("Machine-made")
      ? "Machine-made"
      : null;

  return (
    <article className="flex-col gap-2 p-4 rounded-3xl bg-white flex">
      {/* Image */}
      {product.image ? (
        <Image
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="h-52 w-full rounded-2xl object-cover"
        />
      ) : (
        <div
          className={`flex h-52 flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl text-[13px] text-muted ${style.tint}`}
          aria-hidden="true"
        >
          <div className={`size-21 rounded-full ${style.dot}`} />
          <span>[PRODUCT PHOTO]</span>
        </div>
      )}

      {catalog && (
        <div className="flex-wrap gap-2 justify-between flex items-center">
          <span className="text-[13px] font-bold text-[#8a3b2e] uppercase tracking-widest">
            {style.label}
          </span>
          {tag && (
            <span className="px-3 py-0.5 rounded-full bg-[#f7d9a8] text-[13px] font-bold">
              {tag}
            </span>
          )}
        </div>
      )}
      <h3 className="m-0 font-display text-[21px]">
        <Link href={`/products/${product.slug}`}>{product.name}</Link>
      </h3>
      <p className="m-0 text-[15px] text-muted">{product.description}</p>
      <p className="m-0 font-bold text-ink">${product.price.toFixed(2)}</p>
      {catalog ? (
        <Link
          className="mt-auto px-5.5 min-h-11 justify-center rounded-full bg-ink font-bold text-cream inline-flex items-center"
          href={`/products/${product.slug}`}
        >
          View details
        </Link>
      ) : (
        <button
          className="mt-auto px-7.5 min-h-12 w-full justify-center rounded-full bg-brand font-bold text-ink inline-flex items-center"
          type="button"
        >
          Add to bag
        </button>
      )}
    </article>
  );
}
