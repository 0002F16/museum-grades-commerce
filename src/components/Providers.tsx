"use client";

import { CartProvider } from "@/context/CartContext";
import { ToastProvider } from "@/context/ToastContext";
import type { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <CartProvider>{children}</CartProvider>
    </ToastProvider>
  );
}
