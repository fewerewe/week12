'use client'

import "./globals.css";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { buttonStyles } from "@/components/tailgrids/core/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CartProvider, useCart } from "@/components/cart-context";

function SiteNavigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart, productCount } = useCart();

  function handleLogout() {
    localStorage.removeItem("isLoggedIn");
    router.replace("/login");
  }

  return (
    <nav className="mt-4 flex flex-wrap justify-center gap-3">
      <Link href="/home" className={buttonStyles({ appearance: pathname === "/home" ? "fill" : "outline", variant: "primary" })}>
        Home
      </Link>
      <Link href="/animation" className={buttonStyles({ appearance: pathname === "/animation" ? "fill" : "outline", variant: "primary" })}>
        Animation
      </Link>
      <Link href="/calculator" className={buttonStyles({ appearance: pathname === "/calculator" ? "fill" : "outline", variant: "primary" })}>
        Calculator
      </Link>
      <Link href="/todos" className={buttonStyles({ appearance: pathname === "/todos" ? "fill" : "outline", variant: "primary" })}>
        Todos
      </Link>
      <Link href="/products" className={buttonStyles({ appearance: pathname === "/products" ? "fill" : "outline", variant: "primary" })}>
        Products ({productCount})
      </Link>
      <Link
        href="/carts"
        className={`${buttonStyles({ appearance: pathname === "/carts" ? "fill" : "outline", variant: "primary" })} relative`}
      >
        Carts
        {cart.length > 0 && (
          <span className="absolute -right-2 -top-2 flex min-h-6 min-w-6 items-center justify-center rounded-full bg-red-500 px-1.5 text-xs font-bold leading-none text-white shadow-sm">
            {cart.length}
          </span>
        )}
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center justify-center rounded-lg bg-rose-600 px-4 py-2.5 font-semibold text-white transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
      >
        Logout
      </button>
    </nav>
  );
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <html>
      <body>
        <CartProvider>
          {!isLoginPage && <Header />}
          {!isLoginPage && <SiteNavigation />}
          <main>{children}</main>
          {!isLoginPage && <Footer />}
        </CartProvider>
      </body>
    </html>
  );
}
