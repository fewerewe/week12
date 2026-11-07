"use client";

import Image from "next/image";
import { useCart } from "@/components/cart-context";

export default function CartsPage() {
  const { cart, removeFromCart } = useCart();
  const totalPrice = cart.reduce((total, product) => total + product.price, 0);

  return (
    <main className="mx-auto my-4 w-full max-w-[1600px] px-4">
      <h1 className="mb-6 text-4xl font-bold text-slate-950">Carts</h1>

      <section
        aria-label="สินค้าในรถเข็น"
        className="h-[50vh] min-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3"
      >
        {cart.length === 0 ? (
          <p className="py-12 text-center text-slate-600">
            ยังไม่มีสินค้าในรถเข็น ไปเลือกสินค้าได้ที่หน้า Products
          </p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {cart.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-2xl border border-pink-200 bg-white p-0.5"
              >
                <div className="relative aspect-square overflow-hidden rounded-t-xl bg-slate-200">
                  <Image
                    src={product.imageUrl}
                    alt={product.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover"
                  />
                  <span className="absolute right-2 top-2 rounded-full bg-black/70 px-2.5 py-1 text-sm font-bold text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  <p className="absolute inset-x-0 bottom-0 line-clamp-2 bg-black/70 px-2 py-1 text-sm leading-5 text-white">
                    {product.title}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(product.id)}
                  className="my-1 w-full rounded-lg bg-rose-600 px-3 py-2.5 font-bold text-white transition-colors hover:bg-rose-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-700"
                >
                  Remove
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <footer className="mt-4 flex flex-wrap items-center justify-center gap-4 px-2 py-2 text-lg font-bold">
        <span className="rounded-full border border-amber-500 bg-amber-400 px-5 py-2 text-white shadow-sm">
          Count: {cart.length} {cart.length === 1 ? "item" : "items"}
        </span>
        <span className="rounded-full border border-rose-500 bg-rose-500 px-5 py-2 text-white shadow-sm">
          Price: ${totalPrice.toFixed(2)}
        </span>
      </footer>
    </main>
  );
}
