const categories = [
  { name: "Bracelets", className: "category-bracelets" },
  { name: "Beads", className: "category-beads" },
  { name: "Scarves", className: "category-scarves" },
  { name: "Gloves", className: "category-gloves" },
];

const products = [
  ["Beaded Bracelet", "Hand-strung, adjustable fit.", "product-yellow"],
  ["Mixed Bead Set", "Loose beads for your own designs.", "product-green"],
  ["Handmade Scarf", "Knitted by hand. Also in machine-made.", "product-rose"],
  ["Knit Gloves", "Warm everyday gloves.", "product-lilac"],
];

export function ServicesSection() {
  return (
    <>
      <section
        className="px-5 pb-18 pt-6 mx-auto max-w-300 min-[721px]:px-8"
        id="shop"
        aria-labelledby="shop-title"
      >
        <h2
          className="mb-7 mt-0 font-display text-[34px] min-[721px]:text-[40px]"
          id="shop-title"
        >
          Shop by category
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
          {categories.map((category) => (
            <a
              className="flex-col gap-3.5 flex"
              href="#shop"
              key={category.name}
            >
              <div
                className={`flex min-h-55 items-center justify-center overflow-hidden rounded-3xl ${category.className === "category-bracelets" ? "bg-[#f7d9a8]" : category.className === "category-beads" ? "bg-[#d9e6d3]" : category.className === "category-scarves" ? "bg-[#f2c6bf]" : "bg-[#ebd0da]"}`}
                aria-hidden="true"
              >
                {category.name === "Bracelets" && (
                  <div className="gap-2 flex">
                    <i className="rounded-full bg-red block size-8.5" />
                    <i className="rounded-full bg-ink block size-8.5" />
                    <i className="rounded-full bg-sage block size-8.5" />
                    <i className="rounded-full bg-white block size-8.5" />
                  </div>
                )}
                {category.name === "Beads" && (
                  <div className="gap-3 flex items-center">
                    <i className="rounded-full bg-sage block size-15" />
                    <i className="rounded-full bg-white block size-9.5" />
                    <i className="rounded-full bg-ink block size-5.5" />
                  </div>
                )}
                {category.name === "Scarves" && (
                  <div className="h-32.5 w-[70%] rounded-xl bg-red">
                    <i className="mt-8.5 h-3.5 bg-cream block" />
                    <i className="mt-8 h-3.5 bg-ink block" />
                  </div>
                )}
                {category.name === "Gloves" && (
                  <div className="gap-4 flex">
                    <i className="h-27.5 w-17.5 rounded-[30px_30px_14px_14px] bg-ink block" />
                    <i className="h-27.5 w-17.5 rounded-[30px_30px_14px_14px] bg-[#9c4a68] block" />
                  </div>
                )}
              </div>
              <span className="font-display text-2xl font-bold">
                {category.name}
              </span>
            </a>
          ))}
        </div>
      </section>
      <section className="py-18 bg-white">
        <div className="px-5 mx-auto max-w-300 min-[721px]:px-8">
          <h2 className="mb-7 mt-0 font-display text-[34px] min-[721px]:text-[40px]">
            Handmade or machine-made, always labelled
          </h2>
          <p className="mb-8 mt-0 max-w-160 text-muted">
            We sell scarves both ways. Every listing says how it was made, so
            you can choose by budget, texture or occasion.
          </p>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-6">
            <div className="p-8 rounded-3xl bg-brand">
              <h3 className="mb-2 mt-0 font-display text-[26px]">
                Handmade scarves
              </h3>
              <p className="m-0">
                Knitted or woven by hand. Small runs, slight variation from
                piece to piece, made slowly.
              </p>
            </div>
            <div className="p-8 rounded-3xl bg-[#f3ddd6]">
              <h3 className="mb-2 mt-0 font-display text-[26px]">
                Machine-made scarves
              </h3>
              <p className="m-0 text-muted">
                Consistent, everyday-ready and easier on the wallet, finished
                with our own hand-checked details.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section
        className="px-5 py-18 mx-auto max-w-300 min-[721px]:px-8"
        aria-labelledby="featured-title"
      >
        <h2
          className="mb-7 mt-0 font-display text-[34px] min-[721px]:text-[40px]"
          id="featured-title"
        >
          Featured pieces
        </h2>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-6">
          {products.map(([name, description, className]) => (
            <article
              className="flex-col gap-2.5 p-4 rounded-3xl bg-white flex"
              key={name}
            >
              <div
                className={`flex h-50 min-h-50 items-center justify-center overflow-hidden rounded-2xl text-[13px] text-muted ${className === "product-yellow" ? "bg-[#f7d9a8]" : className === "product-green" ? "bg-[#d9e6d3]" : className === "product-rose" ? "bg-[#f2c6bf]" : "bg-[#ebd0da]"}`}
                aria-hidden="true"
              >
                [PRODUCT PHOTO]
              </div>
              <h3 className="m-0 font-display text-[21px]">{name}</h3>
              <p className="m-0 text-[15px] text-muted">{description}</p>
              <p className="m-0 font-bold text-ink">[PRICE]</p>
              <button
                className="mt-auto px-7.5 min-h-12 w-full justify-center rounded-full bg-brand font-bold text-ink inline-flex items-center"
                type="button"
              >
                Add to bag
              </button>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
