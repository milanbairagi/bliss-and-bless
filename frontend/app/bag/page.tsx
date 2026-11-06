"use client";

import Link from "next/link";
import Image from "next/image";
import { useBag, type BagItem } from "@/components/common/BagProvider";
import { getShippingCost } from "@/services/orderServices";
import { useEffect, useState } from "react";

export default function BagPage() {
  const { items, itemCount, updateQuantity, removeItem } = useBag();
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingThreshold, setShippingThreshold] = useState(0);

  useEffect(() => {
    async function fetchShippingCost() {
      const { fee, threshold } = await getShippingCost();
      setShippingFee(fee);
      setShippingThreshold(threshold);
    }
    fetchShippingCost();
  }, []);

  const shipping = subtotal >= shippingThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  return (
    <main>
      <section className="flex-col gap-8 px-5 pb-18 pt-12 mx-auto max-w-300 min-[721px]:px-8 flex">
        <h1 className="m-0 font-display text-5xl font-bold leading-tight">
          Your bag
        </h1>

        {items.length === 0 ? (
          <EmptyBag />
        ) : (
          <div className="grid gap-10 min-[721px]:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.8fr)] items-start">
            <div className="flex-col gap-4 flex">
              {items.map((item) => (
                <BagItemRow
                  item={item}
                  key={item.key}
                  onQuantityChange={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
            <aside className="flex-col gap-4 p-7 rounded-3xl bg-white flex">
              <h2 className="m-0 font-display text-[26px]">Order summary</h2>
              <SummaryRow label="Items" value={String(itemCount)} />
              <SummaryRow
                label="Subtotal"
                value={`Rs. ${subtotal.toFixed(2)}`}
              />
              <SummaryRow
                label="Shipping"
                value={shipping === 0 ? "Free" : `Rs. ${shipping.toFixed(2)}`}
              />
              <div className="gap-4 pt-4 justify-between border-t border-[#f3ddd6] text-xl flex">
                <span className="font-bold">Total</span>
                <span className="font-bold">Rs. {total.toFixed(2)}</span>
              </div>
              <Link
                className="min-h-13 justify-center rounded-full bg-ink font-bold text-cream inline-flex items-center"
                href="/checkout"
              >
                Checkout
              </Link>
              <Link className="text-center font-medium" href="/products">
                Continue shopping
              </Link>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyBag() {
  return (
    <div className="px-8 py-16 rounded-3xl bg-white text-center">
      <h2 className="mb-2 mt-0 font-display text-3xl">Your bag is empty</h2>
      <p className="mb-6 mt-0 text-muted">
        Bracelets, beads, scarves and gloves are waiting.
      </p>
      <Link
        className="px-7.5 min-h-12 justify-center rounded-full bg-brand font-bold text-ink inline-flex items-center"
        href="/products"
      >
        Continue shopping
      </Link>
    </div>
  );
}

function BagItemRow({
  item,
  onQuantityChange,
  onRemove,
}: {
  item: BagItem;
  onQuantityChange: (key: string, quantity: number) => void;
  onRemove: (key: string) => void;
}) {
  return (
    <article className="flex-wrap gap-5 p-4 rounded-3xl bg-white flex items-center">
      {item.image ? (
        <Image
          src={item.image}
          alt=""
          width={120}
          height={120}
          className="h-30 w-30 rounded-2xl object-cover"
        />
      ) : (
        <div
          className="h-30 w-30 justify-center rounded-2xl flex items-center"
          style={{ backgroundColor: item.tint }}
          aria-hidden="true"
        >
          <div
            className="rounded-full size-16"
            style={{ backgroundColor: item.hex }}
          />
        </div>
      )}
      <div className="flex-1 min-w-45">
        <h2 className="m-0 font-display text-[22px]">{item.name}</h2>
        <p className="mb-2 mt-0 text-[15px] text-muted">{item.detail}</p>
        <p className="m-0 font-bold">Rs. {item.price.toFixed(2)}</p>
      </div>
      <div className="flex-col gap-2.5 items-end flex">
        <div
          className="rounded-full border-2 border-ink bg-white inline-flex items-center"
          role="group"
          aria-label={`Quantity for Rs. {item.name}`}
        >
          <button
            className="border-0 bg-transparent text-xl font-bold text-ink size-11"
            aria-label="Decrease quantity"
            onClick={() => onQuantityChange(item.key, item.quantity - 1)}
            type="button"
          >
            −
          </button>
          <span className="min-w-7 text-center font-bold" aria-live="polite">
            {item.quantity}
          </span>
          <button
            className="border-0 bg-transparent text-xl font-bold text-ink size-11"
            aria-label="Increase quantity"
            onClick={() => onQuantityChange(item.key, item.quantity + 1)}
            type="button"
          >
            +
          </button>
        </div>
        <button
          className="px-2 min-h-11 border-0 bg-transparent text-[15px] text-muted underline"
          onClick={() => onRemove(item.key)}
          type="button"
        >
          Remove
        </button>
      </div>
    </article>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="gap-4 justify-between flex">
      <span>{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}
