import { Carousel } from "@/components/common/Carousel";
import { ProductCard } from "@/components/common/ProductCard";
import { getFeaturedProducts } from "@/services/productServices";
import Link from "next/link";

const categories = [
  {
    name: "Bracelets",
    className: "category-bracelets",
    href: "/products?category=bracelet",
  },
  {
    name: "Beads",
    className: "category-beads",
    href: "/products?category=bead",
  },
  {
    name: "Scarves",
    className: "category-scarves",
    href: "/products?category=scarf",
  },
  {
    name: "Gloves",
    className: "category-gloves",
    href: "/products?category=glove",
  },
];

export async function ServicesSection() {
  const featuredProducts = await getFeaturedProducts();

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
        <Carousel
          ariaLabel="Shop categories"
          itemClassName="w-[82%] sm:w-[46%] md:w-[31%] lg:w-[23.5%]"
          previousLabel="Previous categories"
          nextLabel="Next categories"
        >
          {categories.map((category) => (
            <Link
              className="flex-col gap-3.5 flex"
              href={category.href}
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
            </Link>
          ))}
        </Carousel>
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
        <p className="mb-8 mt-0 max-w-160 text-muted">
          These are our most popular items, carefully selected to showcase the
          best of what we have to offer.
        </p>
        <Carousel
          ariaLabel="Featured products"
          itemClassName="w-[82%] sm:w-[46%] md:w-[31%] lg:w-[23.5%]"
          previousLabel="Previous featured products"
          nextLabel="Next featured products"
        >
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </Carousel>
      </section>
    </>
  );
}
