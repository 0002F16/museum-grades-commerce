"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ShoppingBag, Check } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { useCart, type CartItem } from "@/context/CartContext";

interface AddToCartButtonProps {
  item: CartItem;
}

const baseCls =
  "flex w-full h-[47px] items-center justify-center gap-2.5 text-[13px] font-semibold uppercase tracking-[1.5px] transition-all";

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const { items, addItem } = useCart();
  const { data: session } = useSession();
  const isLoggedIn = !!session?.user;
  const pathname = usePathname();
  const router = useRouter();
  const inCart = items.some((i) => i.id === item.id);

  // Once in the bag, the button becomes a link to the cart — never a dead end.
  if (inCart) {
    return (
      <Link
        href="/cart"
        className={baseCls}
        style={{ backgroundColor: "rgb(25,28,31)", color: "rgb(255,255,255)" }}
      >
        <Check className="h-4 w-4" />
        In Your Bag — View
      </Link>
    );
  }

  function handleAddToCart() {
    if (!isLoggedIn) {
      router.push(`/sign-in?returnTo=${encodeURIComponent(pathname)}`);
      return;
    }
    addItem(item);
  }

  return (
    <button
      onClick={handleAddToCart}
      className={baseCls}
      style={{
        border: "1px solid rgb(25,28,31)",
        color: "rgb(25,28,31)",
        backgroundColor: "transparent",
      }}
    >
      <ShoppingBag className="h-4 w-4" />
      Add to Bag
    </button>
  );
}
