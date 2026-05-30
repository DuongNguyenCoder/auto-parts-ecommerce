export type CartBrand = {
  id: number;
  name: string;
  slug?: string;
};

export type CartItem = {
  id: number;
  productId: number;
  skuId?: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  salePrice?: number;
  quantity: number;
  stock: number;
  brand: CartBrand;
};

export type CartState = {
  items: CartItem[];
  isHydrated: boolean;
  lastUpdated: string | null;
};

export type CartActions = {
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  incrementQuantity: (itemId: number) => void;
  decrementQuantity: (itemId: number) => void;
  setItems: (items: CartItem[]) => void;
  resetCart: () => void;
  hydrate: () => void;
  syncServerCart: (items: CartItem[]) => void;
  mergeGuestCart: (items: CartItem[]) => void;
  replaceCart: (items: CartItem[]) => void;
};
