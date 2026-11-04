"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type BagItem = {
  key: string;
  slug: string;
  name: string;
  detail: string;
  price: number;
  quantity: number;
  image?: string;
  tint: string;
  hex: string;
};

type BagContextValue = {
  items: BagItem[];
  itemCount: number;
  addItem: (item: Omit<BagItem, "quantity">, quantity?: number) => void;
  updateQuantity: (key: string, quantity: number) => void;
  removeItem: (key: string) => void;
};

const BagContext = createContext<BagContextValue | null>(null);
const storageKey = "bliss-and-bless-bag";

export function BagProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<BagItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved) {
        const parsed = JSON.parse(saved) as BagItem[];
        queueMicrotask(() => setItems(parsed));
      }
    } catch {
      window.localStorage.removeItem(storageKey);
    } finally {
      queueMicrotask(() => setHydrated(true));
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items, hydrated]);

  const addItem = useCallback(
    (item: Omit<BagItem, "quantity">, quantity = 1) => {
      setItems((current) => {
        const existing = current.find((entry) => entry.key === item.key);
        if (existing) {
          return current.map((entry) =>
            entry.key === item.key
              ? { ...entry, quantity: Math.min(9, entry.quantity + quantity) }
              : entry,
          );
        }
        return [...current, { ...item, quantity: Math.min(9, quantity) }];
      });
    },
    [],
  );

  const updateQuantity = useCallback((key: string, quantity: number) => {
    setItems((current) =>
      current.map((item) =>
        item.key === key
          ? { ...item, quantity: Math.max(1, Math.min(9, quantity)) }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setItems((current) => current.filter((item) => item.key !== key));
  }, []);

  const value = useMemo(
    () => ({
      items,
      itemCount: items.reduce((total, item) => total + item.quantity, 0),
      addItem,
      updateQuantity,
      removeItem,
    }),
    [items, addItem, updateQuantity, removeItem],
  );

  return <BagContext.Provider value={value}>{children}</BagContext.Provider>;
}

export function useBag() {
  const context = useContext(BagContext);
  if (!context) {
    throw new Error("useBag must be used within a BagProvider");
  }
  return context;
}

export function makeBagItem({
  slug,
  name,
  description,
  price,
  image,
  category,
  detail,
  variantKey,
}: {
  slug: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  category: string;
  detail?: string;
  variantKey?: string;
}): Omit<BagItem, "quantity"> {
  const categoryStyle: Record<string, { tint: string; hex: string }> = {
    bracelets: { tint: "#F7D9A8", hex: "#7A9A78" },
    beads: { tint: "#D9E6D3", hex: "#E8A33D" },
    scarves: { tint: "#F2C6BF", hex: "#C8553D" },
    gloves: { tint: "#EBD0DA", hex: "#9C4A68" },
  };
  const style = categoryStyle[category] ?? {
    tint: "#F2C6BF",
    hex: "#C8553D",
  };

  return {
    key: variantKey ?? slug,
    slug,
    name,
    detail: detail ?? description,
    price,
    image,
    ...style,
  };
}
