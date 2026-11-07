"use client";

import {
  createContext,
  useContext,
  useCallback,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type Product = {
  id: number;
  title: string;
  price: number;
  imageUrl: string;
};

type CartContextValue = {
  cart: Product[];
  productCount: number;
  setProductCount: (count: number) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

let cachedCart: Product[] = [];
let cachedCartJson: string | null = null;
const serverCartSnapshot: Product[] = [];

function isProduct(value: unknown): value is Product {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "title" in value &&
    typeof value.title === "string" &&
    "price" in value &&
    typeof value.price === "number" &&
    "imageUrl" in value &&
    typeof value.imageUrl === "string"
  );
}

function getCartSnapshot(): Product[] {
  const storedCart = localStorage.getItem("cart");
  if (storedCart === cachedCartJson) {
    return cachedCart;
  }

  cachedCartJson = storedCart;
  if (!storedCart) {
    cachedCart = [];
    return cachedCart;
  }

  try {
    const parsedCart: unknown = JSON.parse(storedCart);
    if (Array.isArray(parsedCart) && parsedCart.every(isProduct)) {
      cachedCart = parsedCart;
      return cachedCart;
    }

    throw new Error("Stored cart has an invalid format");
  } catch (error) {
    console.error("Could not restore the saved cart", error);
    localStorage.removeItem("cart");
    cachedCartJson = null;
    cachedCart = [];
    return cachedCart;
  }
}

function getServerCartSnapshot(): Product[] {
  return serverCartSnapshot;
}

function subscribeToCart(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener("cart-change", onChange);

  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener("cart-change", onChange);
  };
}

function saveCart(cart: Product[]) {
  cachedCart = cart;
  cachedCartJson = JSON.stringify(cart);
  localStorage.setItem("cart", cachedCartJson);
  window.dispatchEvent(new Event("cart-change"));
}

function addProduct(product: Product) {
  const currentCart = getCartSnapshot();
  if (!currentCart.some((item) => item.id === product.id)) {
    saveCart([...currentCart, product]);
  }
}

function removeProduct(productId: number) {
  saveCart(getCartSnapshot().filter((product) => product.id !== productId));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [productCount, setProductCount] = useState(0);
  const updateProductCount = useCallback((count: number) => {
    setProductCount(count);
  }, []);
  const cart = useSyncExternalStore(
    subscribeToCart,
    getCartSnapshot,
    getServerCartSnapshot,
  );
  const value: CartContextValue = {
    cart,
    productCount,
    setProductCount: updateProductCount,
    addToCart: addProduct,
    removeFromCart: removeProduct,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
