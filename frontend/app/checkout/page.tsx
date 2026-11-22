"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useBag, type BagItem } from "@/components/common/BagProvider";
import OrderConfirmation, {
  type ConfirmationSnapshot,
} from "@/components/OrderConfirmation";
import { getShippingCost } from "@/services/orderServices";
import type { CustomerDetails } from "@/types/customer";
import {
  OrderRequestError,
  placeOrder,
  type OrderFieldErrors,
} from "@/services/orderServices";

type CheckoutFieldKey = "email" | "first_name" | "last_name" | "address" | "city" | "phone";

const fields: Array<{
  id: string;
  label: string;
  type: string;
  placeholder: string;
  wide?: boolean;
  key: CheckoutFieldKey;
  required: boolean;
  pattern?: string;
  maxLength?: number;
}> = [
  {
    id: "email",
    label: "Email",
    type: "email",
    placeholder: "you@example.com",
    wide: true,
    key: "email",
    required: true,
  },
  {
    id: "first-name",
    label: "First name",
    type: "text",
    placeholder: "",
    key: "first_name",
    required: true,
  },
  {
    id: "last-name",
    label: "Last name",
    type: "text",
    placeholder: "",
    key: "last_name",
    required: true,
  },
  {
    id: "address",
    label: "Address",
    type: "text",
    placeholder: "Street and number",
    wide: true,
    key: "address",
    required: true,
  },
  {
    id: "city",
    label: "City",
    type: "text",
    placeholder: "",
    key: "city",
    required: true,
  },
  {
    id: "phone",
    label: "Phone",
    type: "tel",
    placeholder: "",
    wide: true,
    key: "phone",
    required: true,
    pattern: "^(97|98)[0-9]{8}$",
    maxLength: 10,
  },
];

export default function CheckoutPage() {
  const { items, itemCount, clearBag } = useBag();
  const [paymentMethod, setPaymentMethod] = useState<"card" | "qr">("qr");
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const [shippingFee, setShippingFee] = useState(0);
  const [shippingThreshold, setShippingThreshold] = useState(0);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<OrderFieldErrors>({});
  const [confirmation, setConfirmation] = useState<ConfirmationSnapshot | null>(
    null,
  );
  const [customerDetails, setCustomerDetails] = useState<CustomerDetails>({
    email: "",
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    phone: "",
  });

  useEffect(() => {
    const fetchShippingCost = async () => {
      const { fee, threshold } = await getShippingCost();
      setShippingFee(fee);
      setShippingThreshold(threshold);
    };

    fetchShippingCost();
  }, []);

  const shipping = subtotal >= shippingThreshold ? 0 : shippingFee;
  const total = subtotal + shipping;

  const handlePlaceOrder = useCallback(async () => {
    const missingFieldErrors: OrderFieldErrors = {};
    for (const field of fields) {
      if (!customerDetails[field.key].trim()) {
        missingFieldErrors[field.key] = ["This field is required."];
      }
    }

    if (Object.keys(missingFieldErrors).length > 0) {
      setFieldErrors(missingFieldErrors);
      setOrderError("");
      return;
    }

    setIsPlacingOrder(true);
    setOrderError("");
    setFieldErrors({});
    try {
      const response = await placeOrder(items, customerDetails);
      if (response) {
        setConfirmation({
          order: response,
          items,
          paymentMethod,
          subtotal,
          shipping,
          total,
        });
        clearBag();
      }
    } catch (error) {
      console.error("Error placing order:", error);
      if (error instanceof OrderRequestError) {
        setFieldErrors(error.fieldErrors);
        const nonFieldErrors =
          error.fieldErrors.detail ??
          error.fieldErrors.non_field_errors;
        setOrderError(nonFieldErrors?.join(" ") ?? "");
      } else {
        setOrderError(
          error instanceof Error
            ? error.message
            : "We could not place your order. Please try again.",
        );
      }
    } finally {
      setIsPlacingOrder(false);
    }
  }, [
    items,
    customerDetails,
    paymentMethod,
    subtotal,
    shipping,
    total,
    clearBag,
  ]);

  if (confirmation) {
    return <OrderConfirmation snapshot={confirmation} />;
  }

  return (
    <main>
      <section className="flex-col gap-8 px-5 pb-18 pt-10 mx-auto max-w-300 min-[721px]:px-8 flex">
        <div className="text-[15px] text-muted">
          <Link href="/bag">Bag</Link> /{" "}
          <span className="font-bold">Checkout</span>
        </div>
        <div className="flex-wrap gap-4 justify-between flex items-end">
          <h1 className="m-0 font-display text-5xl font-bold leading-tight">
            Checkout
          </h1>
          <Link className="font-medium underline" href="/bag">
            Back to bag
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="px-8 py-16 rounded-3xl bg-white text-center">
            <h2 className="mb-2 mt-0 font-display text-3xl">
              Your bag is empty
            </h2>
            <p className="mb-6 mt-0 text-muted">
              Add something lovely before checking out.
            </p>
            <Link
              className="px-7.5 min-h-12 justify-center rounded-full bg-brand font-bold text-ink inline-flex items-center"
              href="/products"
            >
              Browse the shop
            </Link>
          </div>
        ) : (
          <div className="grid gap-10 min-[721px]:grid-cols-[minmax(0,1.4fr)_minmax(20rem,0.8fr)] items-start">
            <div className="flex-col gap-6 flex">
              <section className="p-7 rounded-3xl bg-white">
                <h2 className="mb-5 mt-0 font-display text-[26px]">
                  Contact and shipping
                </h2>
                <div className="mb-6 overflow-hidden rounded-2xl">
                  <iframe
                    className="h-60 w-full border-0"
                    title="Map showing the delivery area"
                    src="https://www.google.com/maps?q=Kathmandu%2C%20Nepal&output=embed"
                    loading="lazy"
                  />
                </div>
                <p className="mb-4 mt-0 text-[15px] text-muted">
                  Map preview only. Enter your complete delivery address below.
                </p>
                <div className="grid gap-4 min-[560px]:grid-cols-2">
                  {fields.map((field) => (
                    <label
                      className={field.wide ? "min-[560px]:col-span-2" : ""}
                      key={field.id}
                      htmlFor={field.id}
                    >
                      <span className="mb-1 text-sm font-medium block">
                        {field.label}
                      </span>
                      <input
                        className={`px-4 min-h-12 w-full rounded-[14px] border-2 bg-white text-base text-ink outline-none focus:ring-2 focus:ring-brand ${
                          fieldErrors[field.key]
                            ? "border-red"
                            : "border-ink"
                        }`}
                        id={field.id}
                        placeholder={field.placeholder}
                        type={field.type}
                        required={field.required}
                        pattern={field.pattern}
                        maxLength={field.maxLength}
                        value={customerDetails[field.key]}
                        aria-invalid={Boolean(fieldErrors[field.key])}
                        aria-describedby={
                          fieldErrors[field.key] ? `${field.id}-error` : undefined
                        }
                        onChange={(e) => {
                          setCustomerDetails((prev) => ({
                            ...prev,
                            [field.key]: e.target.value,
                          }));
                          setFieldErrors((prev) => {
                            if (!prev[field.key]) return prev;
                            const next = { ...prev };
                            delete next[field.key];
                            return next;
                          });
                        }}
                      />
                      {fieldErrors[field.key] ? (
                        <span
                          id={`${field.id}-error`}
                          className="mt-1 text-sm text-red block"
                        >
                          {fieldErrors[field.key].join(" ")}
                        </span>
                      ) : null}
                    </label>
                  ))}
                </div>
              </section>

              <section className="p-7 rounded-3xl bg-white">
                <h2 className="mb-4 mt-0 font-display text-[26px]">Payment</h2>
                <div
                  className="flex-wrap gap-3 flex"
                  role="group"
                  aria-label="Payment method"
                >
                  <button
                    className={`min-h-12 rounded-full border-2 border-ink px-5 font-bold ${
                      paymentMethod === "card"
                        ? "bg-ink text-cream"
                        : "bg-white text-ink"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                    type="button"
                  >
                    Card
                  </button>
                  <button
                    className={`min-h-12 rounded-full border-2 border-ink px-5 font-bold ${
                      paymentMethod === "qr"
                        ? "bg-ink text-cream"
                        : "bg-white text-ink"
                    }`}
                    onClick={() => setPaymentMethod("qr")}
                    type="button"
                  >
                    Pay with QR
                  </button>
                </div>
                {paymentMethod === "card" ? (
                  <div className="grid mt-4 gap-4 min-[560px]:grid-cols-2">
                    <CheckoutInput
                      label="Card number"
                      placeholder="0000 0000 0000 0000"
                      wide
                    />
                    <CheckoutInput label="Expiry" placeholder="MM / YY" />
                    <CheckoutInput label="Security code" placeholder="000" />
                  </div>
                ) : (
                  <p className="mb-0 mt-4 text-muted">
                    QR payment details will be shown here when payments are
                    connected.
                  </p>
                )}
              </section>
            </div>

            <aside className="flex-col gap-4 p-7 rounded-3xl bg-white flex">
              <h2 className="m-0 font-display text-[26px]">Order summary</h2>
              {items.map((item) => (
                <CheckoutItem item={item} key={item.key} />
              ))}
              <div className="mt-2 gap-4 pt-4 justify-between border-t border-[#f3ddd6] flex">
                <span>Items ({itemCount})</span>
                <span className="font-bold">Rs. {subtotal.toFixed(2)}</span>
              </div>
              <div className="gap-4 justify-between flex">
                <span>Shipping</span>
                <span className="font-bold">
                  {shipping === 0 ? "Free" : `Rs. ${shipping.toFixed(2)}`}
                </span>
              </div>
              <div className="gap-4 pt-4 justify-between border-t border-[#f3ddd6] text-xl flex">
                <span className="font-bold">Total</span>
                <span className="font-bold">Rs. {total.toFixed(2)}</span>
              </div>
              <button
                onClick={handlePlaceOrder}
                className="min-h-13 rounded-full bg-ink font-bold text-cream active:bg-ink/90 disabled:cursor-not-allowed disabled:bg-ink/50 disabled:text-cream/70"
                type="button"
                disabled={isPlacingOrder}
              >
                {isPlacingOrder ? "Placing order..." : "Place order"}
              </button>
              {orderError ? (
                <p className="m-0 text-center text-sm text-red" role="alert">
                  {orderError}
                </p>
              ) : null}
              <p className="m-0 text-center text-sm text-muted">
                Payments are not connected yet.
              </p>
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}

function CheckoutInput({
  label,
  placeholder,
  wide = false,
}: {
  label: string;
  placeholder: string;
  wide?: boolean;
}) {
  return (
    <label className={wide ? "min-[560px]:col-span-2" : ""}>
      <span className="mb-1 text-sm font-medium block">{label}</span>
      <input
        className="px-4 min-h-12 w-full rounded-[14px] border-2 border-ink bg-white text-base text-ink outline-none focus:ring-2 focus:ring-brand"
        placeholder={placeholder}
        type="text"
      />
    </label>
  );
}

function CheckoutItem({ item }: { item: BagItem }) {
  return (
    <div className="gap-3.5 flex items-center">
      {item.image ? (
        <Image
          alt=""
          className="h-14 w-14 rounded-xl object-cover"
          height={56}
          src={item.image}
          width={56}
        />
      ) : (
        <div
          aria-hidden="true"
          className="h-14 w-14 justify-center rounded-xl flex items-center"
          style={{ backgroundColor: item.tint }}
        >
          <div
            className="rounded-full size-7"
            style={{ backgroundColor: item.hex }}
          />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="font-bold">{item.name}</div>
        <div className="text-sm text-muted">Qty {item.quantity}</div>
      </div>
      <span className="font-bold">
        Rs. {(item.price * item.quantity).toFixed(2)}
      </span>
    </div>
  );
}
