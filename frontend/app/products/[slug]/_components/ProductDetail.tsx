"use client";

import Link from "next/link";
import { useState } from "react";
import type { MultiColorProductDetail, ProductDetail } from "@/types/product";
import Image from "next/image";
import { makeBagItem, useBag } from "@/components/common/BagProvider";

function isMultiColorProduct(
  product: ProductDetail,
): product is MultiColorProductDetail {
  return Array.isArray(product.image);
}

export function ProductDetail({
  productDetail,
}: {
  productDetail: ProductDetail;
}) {
  const [colorIndex, setColorIndex] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useBag();
  const isMultiColor = isMultiColorProduct(productDetail);
  const selectedColorImage = isMultiColor
    ? productDetail.image[colorIndex]
    : null;
  const selectedColor = Array.isArray(productDetail.colors)
    ? productDetail.colors[colorIndex]
    : null;
  const selectedMainImage = isMultiColor
    ? selectedColorImage?.url
    : productDetail.image;
  const selectedOtherImages = isMultiColor
    ? (productDetail.other_images.find(
        (images) =>
          images.color === selectedColorImage?.color ||
          images.color === selectedColor?.name,
      )?.urls ?? [])
    : productDetail.other_images;
  const galleryImages = selectedOtherImages.filter((image): image is string =>
    Boolean(image),
  );
  const selectedImage =
    galleryImages[imageIndex] ?? selectedMainImage ?? galleryImages[0];

  const selectedColorName = selectedColorImage?.color ?? selectedColor?.name;

  return (
    <main>
      <div className="px-5 pt-7 mx-auto max-w-300 text-[15px] text-muted min-[721px]:px-8">
        <Link href="/">Home</Link> /{" "}
        <Link href={`/products?category=${productDetail.category}`}>
          {productDetail.category}
        </Link>{" "}
        / <span>{productDetail.name}</span>
      </div>

      <section className="grid gap-14 px-5 py-6 pb-18 mx-auto max-w-300 min-[721px]:grid-cols-[repeat(auto-fit,minmax(340px,1fr))] min-[721px]:px-8 items-start">
        <div className="flex-col gap-4 flex">
          <div className="overflow-hidden rounded-4xl bg-[#f2c6bf] relative">
            {selectedImage ? (
              <Image
                src={selectedImage}
                alt={productDetail.name}
                width={800}
                height={600}
                priority
                className="object-cover w-full h-full"
              />
            ) : (
              <div className="h-full min-h-125 justify-center text-muted flex items-center">
                No image available
              </div>
            )}
          </div>
          {galleryImages.length > 1 ? (
            <div
              className="grid grid-cols-3 gap-4"
              role="group"
              aria-label={`Images of ${productDetail.name}`}
            >
              {galleryImages.map((image, index) => (
                <button
                  className={`relative h-27.5 overflow-hidden rounded-2xl bg-white ${
                    index === imageIndex
                      ? "outline-2 outline-ink outline-offset-2"
                      : ""
                  }`}
                  key={`${image}-${index}`}
                  onClick={() => setImageIndex(index)}
                  aria-label={`View image ${index + 1} of ${galleryImages.length}`}
                  aria-pressed={index === imageIndex}
                  type="button"
                >
                  <Image
                    src={image}
                    alt=""
                    width={800}
                    height={600}
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        <div className="flex-col gap-5.5 flex">
          <div>
            <p className="mb-1.5 mt-0 text-[14px] font-bold text-[#8a3b2e] uppercase tracking-[0.12em]">
              {productDetail.category}
            </p>
            <h1 className="m-0 font-display text-[clamp(42px,5vw,48px)] font-bold leading-[1.05]">
              {productDetail.name}
            </h1>
            <p className="mb-0 mt-3 text-2xl font-bold">
              Rs. {productDetail.price.toFixed(2)}
            </p>
          </div>

          {/* <p className="m-0 text-muted">{makes[0].note}</p> */}

          <div>
            <p className="mb-2 mt-0 font-bold">Made: {productDetail.make}</p>
          </div>
          <div>
            {selectedColorName && (
              <p className="mb-2 mt-0 font-bold">Color: {selectedColorName}</p>
            )}
            <div
              className="flex-wrap gap-1.5 flex"
              role="group"
              aria-label={`Color options for ${productDetail.name}`}
            >
              {productDetail.colors &&
                Array.isArray(productDetail.colors) &&
                productDetail.colors.map((swatch, index) => (
                  <button
                    className={`size-11 rounded-full border-3 border-cream shadow-[inset_0_0_0_2px_var(--color-cream)] ${
                      index === colorIndex
                        ? "outline-2 outline-ink outline-offset-1"
                        : ""
                    }`}
                    aria-label={swatch.name}
                    aria-pressed={index === colorIndex}
                    key={swatch.name}
                    onClick={() => {
                      setColorIndex(index);
                      setImageIndex(0);
                      setAdded(false);
                    }}
                    style={{ backgroundColor: swatch.hex }}
                    type="button"
                  />
                ))}
            </div>
          </div>

          <div className="flex-wrap gap-4 items-center flex">
            <div
              className="rounded-full border-2 border-ink bg-white inline-flex items-center"
              role="group"
              aria-label="Quantity"
            >
              <button
                className="border-0 bg-transparent text-[22px] font-bold text-ink size-12"
                aria-label="Decrease quantity"
                onClick={() => {
                  setQuantity((current) => Math.max(1, current - 1));
                  setAdded(false);
                }}
                type="button"
              >
                −
              </button>
              <span
                className="min-w-9 text-center font-bold"
                aria-live="polite"
              >
                {quantity}
              </span>
              <button
                className="border-0 bg-transparent text-[22px] font-bold text-ink size-12"
                aria-label="Increase quantity"
                onClick={() => {
                  setQuantity((current) => Math.min(9, current + 1));
                  setAdded(false);
                }}
                type="button"
              >
                +
              </button>
            </div>
            <button
              className="flex-1 px-7.5 min-h-13 min-w-50 rounded-full border-0 bg-ink font-bold text-cream"
              onClick={() => {
                addItem(
                  makeBagItem({
                    slug: productDetail.slug,
                    name: productDetail.name,
                    description: productDetail.description,
                    price: productDetail.price,
                    category: productDetail.category,
                    image: selectedImage,
                    detail: selectedColorName
                      ? `${productDetail.make} · ${selectedColorName}`
                      : productDetail.make,
                    variantKey: `${productDetail.slug}:${selectedColorName ?? "default"}`,
                  }),
                  quantity,
                );
                setAdded(true);
              }}
              type="button"
            >
              {added ? "Added to bag" : "Add to bag"}
            </button>
          </div>

          <div className="px-6 py-2 rounded-3xl bg-white">
            {productDetail.details.map(([label, value], index) => (
              <div
                className={`flex justify-between gap-4 py-3.5 ${
                  index < productDetail.details.length - 1
                    ? "border-b border-[#f3ddd6]"
                    : ""
                }`}
                key={label}
              >
                <span className="font-bold">{label}</span>
                <span className="text-right text-muted">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
