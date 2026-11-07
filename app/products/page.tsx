"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useCart, type Product } from "@/components/cart-context";

const samplePrices = [62.83, 48.28, 99.56, 44.27, 36.86, 31.64, 0.89, 62.16, 76.65, 65.75];

function priceFor(id: number): number {
  if (id <= samplePrices.length) {
    return samplePrices[id - 1];
  }

  return Number((((id * 7919) % 9999) / 100 + 0.01).toFixed(2));
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { cart, addToCart, setProductCount } = useCart();

  useEffect(() => {
    const controller = new AbortController();

    async function loadProducts() {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/photos?_limit=111",
          { signal: controller.signal },
        );

        if (!response.ok) {
          throw new Error(`โหลดสินค้าไม่สำเร็จ (${response.status})`);
        }

        const photos: { id: number; title: string }[] = await response.json();
        const loadedProducts = photos.map((photo) => ({
            ...photo,
            price: priceFor(photo.id),
            imageUrl: `https://picsum.photos/id/${photo.id}/400/400`,
          }));
        setProducts(loadedProducts);
        setProductCount(loadedProducts.length);
      } catch (loadError) {
        if (!controller.signal.aborted) {
          setProductCount(0);
          setError(
            loadError instanceof Error
              ? loadError.message
              : "เกิดข้อผิดพลาดขณะโหลดสินค้า",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    void loadProducts();
    return () => controller.abort();
  }, [setProductCount]);

  return (
    <main className="mx-auto my-4 w-full max-w-[1600px] px-4">
      <section
        aria-label="รายการสินค้า"
        className="h-[70vh] min-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-white p-3"
      >
        {isLoading && (
          <p className="py-8 text-center text-slate-600">กำลังโหลดสินค้า...</p>
        )}

        {!isLoading && error && (
          <p role="alert" className="py-8 text-center text-red-600">
            {error}
          </p>
        )}

        {!isLoading && !error && (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {products.map((product) => {
              const isAdded = cart.some((item) => item.id === product.id);

              return (
                <article
                  key={product.id}
                  className="overflow-hidden rounded-2xl border-2 border-cyan-500 bg-cyan-50 p-0.5"
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
                    aria-pressed={isAdded}
                    onClick={() => addToCart(product)}
                    className="my-1 w-full rounded-lg bg-emerald-500 px-3 py-2.5 font-bold text-white transition-colors hover:bg-emerald-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-700"
                  >
                    {isAdded ? "Added to Carts" : "Add to Carts"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
