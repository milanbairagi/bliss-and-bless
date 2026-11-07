"use client";

import Image from "next/image";
import Link from "next/link";
import type { BagItem } from "@/components/common/BagProvider";
import type { orderConfirmation } from "@/types/order";

export type ConfirmationSnapshot = {
  order: orderConfirmation;
  items: BagItem[];
  paymentMethod: "card" | "qr";
  subtotal: number;
  shipping: number;
  total: number;
};

export default function OrderConfirmation({
  snapshot,
}: {
  snapshot: ConfirmationSnapshot;
}) {
  const { order, items, paymentMethod, subtotal, shipping, total } = snapshot;
  const itemRows =
    items.length > 0
      ? items
      : order.items.map((item) => ({
          key: item.key,
          name: item.key.replaceAll("-", " "),
          quantity: item.quantity,
          price: 0,
          detail: "",
          slug: item.key,
          tint: "#F2C6BF",
          hex: "#C8553D",
          image: undefined,
        }));

  return (
    <main>
      <section className="flex-col gap-8 px-5 pb-20 pt-14 mx-auto max-w-250 min-[721px]:px-8 flex">
        <div className="flex-col gap-3 text-center items-center flex">
          <div
            aria-hidden="true"
            className="justify-center rounded-full bg-brand size-19 flex items-center"
          >
            <svg
              aria-hidden="true"
              className="size-9"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2.6"
            >
              <path d="m5 12.5 4.5 4.5L19 7.5" />
            </svg>
          </div>
          <h1 className="m-0 font-display text-5xl font-bold min-[721px]:text-[52px] leading-tight">
            Thank you for your order
          </h1>
          <p className="m-0 max-w-130 text-muted">
            Order <strong>{order.reference_id}</strong> is confirmed. We&apos;ve
            sent a receipt to {order.email} and will let you know when it ships.
          </p>
        </div>

        <div className="grid gap-6 min-[721px]:grid-cols-2 items-start">
          <section className="flex-col gap-4 p-7 rounded-3xl bg-white flex">
            <h2 className="m-0 font-display text-2xl">Your order</h2>
            {itemRows.map((item) => (
              <div className="gap-3.5 flex items-center" key={item.key}>
                {item.image ? (
                  <Image
                    alt=""
                    className="rounded-xl object-cover size-14"
                    height={56}
                    src={item.image}
                    width={56}
                  />
                ) : (
                  <div
                    aria-hidden="true"
                    className="justify-center rounded-xl size-14 flex items-center"
                    style={{ backgroundColor: item.tint }}
                  >
                    <div
                      className="rounded-full size-7"
                      style={{ backgroundColor: item.hex }}
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold capitalize">{item.name}</div>
                  <div className="text-sm text-muted">
                    {item.detail ? `${item.detail} · ` : ""}Qty {item.quantity}
                  </div>
                </div>
                <span className="font-bold">
                  Rs. {(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <SummaryRow label="Subtotal" value={`Rs. ${subtotal.toFixed(2)}`} />
            <SummaryRow
              label="Shipping"
              value={shipping === 0 ? "Free" : `Rs. ${shipping.toFixed(2)}`}
            />
            <SummaryRow
              emphasized
              label="Total"
              value={`Rs. ${total.toFixed(2)}`}
            />
          </section>

          <div className="flex-col gap-6 flex">
            <InfoCard title="Delivery">
              <p className="m-0 text-muted">
                {order.first_name} {order.last_name}
                <br />
                {order.address}
                <br />
                {order.city}
              </p>
              <p className="mb-0 mt-3">
                <strong>Method:</strong> Standard delivery
              </p>
              <p className="m-0">
                <strong>Estimated arrival:</strong> Within 1-2 business days
              </p>
            </InfoCard>
            <InfoCard title="Payment">
              <p className="m-0 text-muted">
                {paymentMethod === "qr" ? "QR payment" : "Card payment"}
              </p>
            </InfoCard>
          </div>
        </div>

        <section className="p-7 rounded-3xl bg-accent">
          <h2 className="mb-4 mt-0 font-display text-2xl">What happens next</h2>
          <div className="grid gap-5 min-[721px]:grid-cols-3">
            <NextStep title="1. Order received">
              We have your order and are getting it ready.
            </NextStep>
            <NextStep title="2. Verified by our staff">
              Our staff will verify your order details before it is prepared.
            </NextStep>
            <NextStep title="3. Made and packed">
              Your pieces are checked and wrapped by hand.
            </NextStep>
            <NextStep title="4. On its way">
              You&apos;ll get a message with tracking details.
            </NextStep>
          </div>
        </section>

        <div className="flex-wrap gap-4 justify-center flex">
          <Link
            className="px-8 min-h-13 justify-center rounded-full bg-ink font-bold text-cream inline-flex items-center"
            href="/products"
          >
            Back to the shop
          </Link>
          <Link
            className="px-8 min-h-13 justify-center rounded-full border-2 border-ink font-bold inline-flex items-center"
            href="/#story"
          >
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}

function SummaryRow({
  emphasized = false,
  label,
  value,
}: {
  emphasized?: boolean;
  label: string;
  value: string;
}) {
  return (
    <div
      className={`gap-4 justify-between flex ${
        emphasized
          ? "pt-4 border-t border-[#f3ddd6] text-xl"
          : "border-t border-[#f3ddd6] pt-4"
      }`}
    >
      <span className="font-bold">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function InfoCard({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <section className="p-7 rounded-3xl bg-white">
      <h2 className="mb-3 mt-0 font-display text-2xl">{title}</h2>
      {children}
    </section>
  );
}

function NextStep({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div>
      <div className="font-bold">{title}</div>
      <p className="mb-0 mt-1">{children}</p>
    </div>
  );
}
