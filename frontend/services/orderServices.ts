export async function getShippingCost(): Promise<{
  fee: number;
  threshold: number;
}> {
  // Dummy implementation for fetching shipping fee
  const returnData = { fee: 75, threshold: 300 };
  return new Promise((resolve) => setTimeout(() => resolve(returnData), 1000));
}
