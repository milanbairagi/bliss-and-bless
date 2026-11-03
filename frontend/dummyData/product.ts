import type { Product, ProductDetail } from "@/types/product";

export const multiColorProductDetail: ProductDetail = {
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

export const singleColorProductDetail: ProductDetail = {
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

export const products: Product[] = [
  {
    id: 1,
    name: "Beaded Bracelet",
    description: "Hand-strung, adjustable fit.",
    price: 29.99,
    slug: "beaded-bracelet",
    category: "bracelets",
  },
  {
    id: 2,
    name: "Mixed Bead Set",
    description: "Loose beads for your own designs.",
    price: 19.99,
    slug: "mixed-bead-set",
    category: "beads",
  },
  {
    id: 3,
    name: "Handmade Scarf",
    description: "Knitted by hand. Also in machine-made.",
    price: 49.99,
    slug: "handmade-scarf",
    category: "scarves",
  },
  {
    id: 4,
    name: "Knit Gloves",
    description: "Warm everyday gloves.",
    price: 24.99,
    slug: "knit-gloves",
    category: "gloves",
  },
  {
    id: 5,
    name: "Woven Scarf",
    description: "Machine-made, everyday scarf.",
    price: 39.99,
    slug: "woven-scarf",
    category: "scarves",
  },
];

export const featuredProducts: Product[] = [
  products[0],
  products[2],
  products[4],
];
