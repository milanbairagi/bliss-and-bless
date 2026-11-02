export interface ProductCardProps {
  name: string;
  description: string;
  price: number;
}

export function ProductCard({ name, description, price }: ProductCardProps) {
  return (
    <article className="flex-col gap-2.5 p-4 rounded-3xl bg-white flex">
      <div
        className={`flex h-50 min-h-50 items-center justify-center overflow-hidden rounded-2xl text-[13px] text-muted bg-[#ebd0da]`}
        aria-hidden="true"
      >
        [PRODUCT PHOTO]
      </div>
      <h3 className="m-0 font-display text-[21px]">{name}</h3>
      <p className="m-0 text-[15px] text-muted">{description}</p>
      <p className="m-0 font-bold text-ink">${price.toFixed(2)}</p>
      <button
        className="mt-auto px-7.5 min-h-12 w-full justify-center rounded-full bg-brand font-bold text-ink inline-flex items-center"
        type="button"
      >
        Add to bag
      </button>
    </article>
  );
}
