"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useSession } from "@/lib/auth-client";
import { useToast } from "@/context/ToastContext";
import {
  getCartAction,
  addCartAction,
  removeCartAction,
  clearCartAction,
  mergeCartAction,
} from "@/app/actions/cart";
import type { CartItem } from "@/types/cart";

export type { CartItem } from "@/types/cart";

// ─── State ────────────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; item: CartItem }
  | { type: "REMOVE_ITEM"; id: string }
  | { type: "CLEAR" }
  | { type: "HYDRATE"; items: CartItem[] };

interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM":
      // Each luxury item is unique — no duplicates
      if (state.items.some((i) => i.id === action.item.id)) return state;
      return { ...state, items: [...state.items, action.item] };
    case "REMOVE_ITEM":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "CLEAR":
      return { ...state, items: [] };
    case "HYDRATE":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "mg_cart_v1";

function readGuestCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const { data: session, isPending } = useSession();
  const { show } = useToast();
  const userId = session?.user?.id ?? null;

  // Tracks which auth identity the in-memory cart is currently synced to.
  // "guest" while logged out; the user id once a user's DB cart is loaded.
  const syncedFor = useRef<string | "guest" | null>(null);

  // ── Sync cart to the current auth identity ──────────────────────────────────
  useEffect(() => {
    if (isPending) return; // wait for session to resolve

    // Logged-in user we haven't synced yet → merge guest cart, load DB cart.
    if (userId && syncedFor.current !== userId) {
      let cancelled = false;
      (async () => {
        const guestItems = readGuestCart();
        const merged =
          guestItems.length > 0
            ? await mergeCartAction(guestItems.map((i) => i.id))
            : await getCartAction();
        if (cancelled) return;
        dispatch({ type: "HYDRATE", items: merged });
        // Guest cart has been absorbed into the account — clear it.
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // ignore
        }
        syncedFor.current = userId;
      })();
      return () => {
        cancelled = true;
      };
    }

    // Guest (logged out) and not yet synced → load from localStorage.
    if (!userId && syncedFor.current !== "guest") {
      dispatch({ type: "HYDRATE", items: readGuestCart() });
      syncedFor.current = "guest";
    }
  }, [userId, isPending]);

  // ── Persist guest cart to localStorage (only while logged out) ──────────────
  useEffect(() => {
    if (userId) return; // logged-in carts live in the DB
    if (syncedFor.current !== "guest") return; // avoid clobbering before hydrate
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.items));
    } catch {
      // ignore
    }
  }, [state.items, userId]);

  // ── Mutations: optimistic local update + DB write when logged in ────────────
  function addItem(item: CartItem) {
    if (state.items.some((i) => i.id === item.id)) return;
    dispatch({ type: "ADD_ITEM", item });
    if (userId) void addCartAction(item.id);
    show("Added to bag", { label: "View bag", href: "/cart" });
  }

  function removeItem(id: string) {
    dispatch({ type: "REMOVE_ITEM", id });
    if (userId) void removeCartAction(id);
    show("Removed from bag");
  }

  function clearCart() {
    dispatch({ type: "CLEAR" });
    if (userId) void clearCartAction();
  }

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        count: state.items.length,
        addItem,
        removeItem,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within <CartProvider>");
  return ctx;
}
