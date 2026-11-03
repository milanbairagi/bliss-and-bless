import type { ProductDetail } from "@/types/product";

const multiColorProduct: ProductDetail = {
  id: 1,
  slug: "the-everyday-scarf",
  name: "The Everyday Scarf",
  description: "Choose the color and finish for your everyday scarf.",
  price: 49.99,
  colors: [
    { name: "Red", hex: "#FF0000" },
    { name: "Blue", hex: "#0000FF" },
    { name: "Green", hex: "#00FF00" },
  ],
  category: "scarf",
  make: "handmade",
  image: [
    { color: "Red", url: "https://dummyimages.dev/800x600.webp" },
    { color: "Blue", url: "https://dummyimages.dev/800x600.webp" },
    { color: "Green", url: "https://dummyimages.dev/800x600.webp" },
  ],
  other_images: [
    {
      color: "Red",
      urls: [
        "https://dummyimages.dev/800x600.webp",
        "https://dummyimages.dev/800x600.webp",
        "https://dummyimages.dev/800x600.webp",
      ],
    },
    {
      color: "Blue",
      urls: [
        "https://dummyimages.dev/800x600.webp",
        "https://dummyimages.dev/800x600.webp",
      ],
    },
    {
      color: "Green",
      urls: [
        "https://dummyimages.dev/800x600.webp",
        "https://dummyimages.dev/800x600.webp",
      ],
    },
  ],
  details: [
    ["Material", "Soft cotton blend"],
    ["Size", "180 × 50 cm"],
    ["Care", "Gentle machine wash"],
    ["Shipping", "Free over Rs. 500"],
  ],
  stock: [
    { color: "Red", quantity: 10 },
    { color: "Blue", quantity: 5 },
    { color: "Green", quantity: 0 },
  ],
};

const singleColorProduct: ProductDetail = {
  id: 2,
  slug: "the-everyday-scarf-single",
  name: "The Everyday Scarf - Single Color",
  description: "A single color version of the everyday scarf.",
  price: 39.99,
  colors: null,
  category: "scarf",
  make: "machine-made",
  image: "https://dummyimages.dev/800x600.webp",
  other_images: [
    "https://dummyimages.dev/800x600.webp",
    "https://dummyimages.dev/800x600.webp",
  ],
  details: [
    ["Material", "Soft cotton blend"],
    ["Size", "180 × 50 cm"],
    ["Care", "Gentle machine wash"],
    ["Shipping", "Free over Rs. 500"],
  ],
  stock: 20,
};

export async function getProductBySlug(
  slug: string,
): Promise<ProductDetail | null> {
  // Dummy implementation for fetching product data by slug
  if (!slug) return null;
  const returnData: ProductDetail = multiColorProduct;

  // Sleep 2 sec
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const res = await Promise.resolve({
    ok: true,
    json: async () => returnData,
  });

  if (!res.ok) return null;
  return res.json();
}
