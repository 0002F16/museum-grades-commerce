import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartView } from "@/components/CartView";

export const metadata = { title: "Your Bag — Museum Grades" };

export default function CartPage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <CartView />
      </main>
      <Footer />
    </>
  );
}
