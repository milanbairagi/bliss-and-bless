import { BagItem } from "@/components/common/BagProvider";
import type { CustomerDetails } from "@/types/customer";
import type { orderConfirmation } from "@/types/order";

export type OrderFieldErrors = Record<string, string[]>;

export class OrderRequestError extends Error {
  fieldErrors: OrderFieldErrors;

  constructor(fieldErrors: OrderFieldErrors = {}, message = "Please correct the highlighted fields.") {
    super(message);
    this.name = "OrderRequestError";
    this.fieldErrors = fieldErrors;
  }
}

export async function getShippingCost(): Promise<{
  fee: number;
  threshold: number;
}> {
  const response = await fetch("/api/shipping-fee/");
  if (!response.ok) {
    throw new Error("Failed to fetch shipping cost");
  }
  return response.json();
}

export async function placeOrder(
  items: BagItem[],
  customerDetails: CustomerDetails,
): Promise<orderConfirmation> {
  if (items.length === 0) {
    throw new Error("Cannot place order with an empty bag.");
  }
  if (!customerDetails) {
    throw new Error("Customer details are required to place an order.");
  }

  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...customerDetails,
      items: items.map((item) => ({
        key: item.key,
        quantity: item.quantity,
      })),
    }),
  };

  const response = await fetch("/api/orders/", request);

  if (!response.ok) {
    let payload: unknown = null;

    try {
      payload = await response.json();
    } catch {
      throw new Error("Failed to place order");
    }

    if (payload && typeof payload === "object" && !Array.isArray(payload)) {
      const fieldErrors: OrderFieldErrors = {};

      for (const [field, value] of Object.entries(payload)) {
        if (Array.isArray(value)) {
          fieldErrors[field] = value
            .filter((message): message is string => typeof message === "string")
            .map((message) => message);
        } else if (typeof value === "string") {
          fieldErrors[field] = [value];
        }
      }

      if (Object.keys(fieldErrors).length > 0) {
        throw new OrderRequestError(fieldErrors);
      }
    }

    throw new Error("Failed to place order");
  }

  return response.json();
}
