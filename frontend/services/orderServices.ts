import { BagItem } from "@/components/common/BagProvider";
import type { CustomerDetails } from "@/types/customer";
import type { orderConfirmation } from "@/types/order";
import { orderConfirmationDummyData } from "@/dummyData/order";

export async function getShippingCost(): Promise<{
  fee: number;
  threshold: number;
}> {
  // Dummy implementation for fetching shipping fee
  const returnData = { fee: 75, threshold: 300 };
  return new Promise((resolve) => setTimeout(() => resolve(returnData), 1000));
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

  return new Promise((resolve) =>
    setTimeout(() => resolve(orderConfirmationDummyData), 1000),
  );
}
