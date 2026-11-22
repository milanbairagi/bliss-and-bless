import { BagItem } from "@/components/common/BagProvider";
import type { CustomerDetails } from "@/types/customer";
import type { orderConfirmation } from "@/types/order";

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

// Dummy place order function
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
    throw new Error("Failed to place order");
  }

  return response.json();
}
