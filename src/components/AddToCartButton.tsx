"use client";

import { ShoppingBag, Check } from "lucide-react";
import { useCart, type CartItem } from "@/context/CartContext";

interface AddToCartButtonProps {
  item: CartItem;
}

export function AddToCartButton({ item }: AddToCartButtonProps) {
  const { items, addItem, openCart } = useCart();
  const inCart = items.some((i) => i.id === item.id);

  function handleClick() {
    if (!inCart) addItem(item);
    openCart();
  }

  return (
    <button
      onClick={handleClick}
      className="flex w-full h-[47px] items-center justify-center gap-2.5 text-[13px] font-semibold uppercase tracking-[1.5px] transition-all"
      style={
        inCart
          ? {
              backgroundColor: "rgb(25,28,31)",
              color: "rgb(255,255,255)",
            }
          : {
              border: "1px solid rgb(25,28,31)",
              color: "rgb(25,28,31)",
              backgroundColor: "transparent",
            }
      }
    >
      {inCart ? (
        <>
          <Check className="h-4 w-4" />
          In Your Bag
        </>
      ) : (
        <>
          <ShoppingBag className="h-4 w-4" />
          Add to Bag
        </>
      )}
    </button>
  );
}
