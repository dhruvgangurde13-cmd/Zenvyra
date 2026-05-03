"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { toast } from "sonner";
import { ProductImage } from "@/components/ProductImage";

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setProduct(data.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const addToCart = async () => {
    const token = localStorage.getItem("zenvyra_token");
    if (!token) {
      router.push("/login");
      return;
    }

    setAdding(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/cart/items", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: id, quantity }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Added to cart!");
      } else {
        toast.error(data.detail || "Could not add to cart.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setAdding(false);
    }
  };

  /* ---------- loading skeleton ---------- */
  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 pt-8 pb-16 md:pt-12 md:pb-24">
        <div className="h-4 w-40 bg-[#1A1D24] rounded-lg animate-pulse mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14">
          <div className="aspect-square bg-[#1A1D24] rounded-3xl animate-pulse" />
          <div className="space-y-4 pt-4">
            <div className="h-8 w-3/4 bg-[#1A1D24] rounded-xl animate-pulse" />
            <div className="h-6 w-24 bg-[#1A1D24] rounded-lg animate-pulse" />
            <div className="h-4 w-full bg-[#1A1D24] rounded-lg animate-pulse mt-6" />
            <div className="h-4 w-5/6 bg-[#1A1D24] rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto max-w-5xl px-4 py-32 text-center">
        <h2 className="text-2xl font-semibold text-[#9CA3AF] mb-4">
          Product not found
        </h2>
        <Link
          href="/products"
          className="text-[#A78BFA] hover:underline text-sm"
        >
          ← Back to Collection
        </Link>
      </div>
    );
  }

  const inStock = product.stock > 0;
  const maxQty = Math.min(product.stock, 10);

  return (
    <div className="container mx-auto max-w-5xl px-4 pt-8 pb-16 md:pt-12 md:pb-24">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-[13px] text-[#6B7280] mb-10">
        <Link href="/products" className="hover:text-[#9CA3AF] transition-colors">
          Collection
        </Link>
        <span>/</span>
        <span className="text-[#F9FAFB]">{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-14 items-start">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <ProductImage
            src={product.image_url}
            alt={product.title}
            aspect="aspect-square"
            category={product.category}
            soldOut={!inStock}
          />
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
          className="flex flex-col"
        >
          <h1 className="text-3xl md:text-[32px] font-bold tracking-[-0.02em] text-[#F9FAFB] mb-2">
            {product.title}
          </h1>

          <span className="text-xl md:text-[24px] font-semibold text-[#F9FAFB] mb-6">
            ${product.price}
          </span>

          {product.description && (
            <p className="text-[15px] text-[#9CA3AF] leading-relaxed mb-8">
              {product.description}
            </p>
          )}

          {/* Stock Indicator */}
          <div className="flex items-center gap-2 mb-8">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                inStock ? "bg-emerald-400" : "bg-red-400"
              }`}
            />
            <span className="text-[13px] text-[#6B7280]">
              {inStock ? `${product.stock} in stock` : "Out of stock"}
            </span>
          </div>

          {/* Quantity Selector */}
          {inStock && (
            <div className="flex items-center gap-4 mb-8">
              <span className="text-[13px] font-medium text-[#9CA3AF]">
                Quantity
              </span>
              <div className="flex items-center border border-white/[0.1] rounded-full overflow-hidden">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#9CA3AF] hover:bg-white/[0.05] transition-colors text-lg"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="w-10 text-center text-[14px] font-medium text-[#F9FAFB]">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                  className="w-10 h-10 flex items-center justify-center text-[#9CA3AF] hover:bg-white/[0.05] transition-colors text-lg"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {/* Add to Cart */}
          <button
            onClick={addToCart}
            disabled={!inStock || adding}
            className="h-14 w-full rounded-full text-[14px] font-medium tracking-[0.01em] transition-all duration-300 ease-out
              bg-[#A78BFA] text-white hover:bg-[#B9A0FF] hover:scale-[1.01] active:scale-[0.99]
              shadow-[0_4px_20px_-4px_rgba(167,139,250,0.4)]
              disabled:bg-[#1A1D24] disabled:text-[#6B7280] disabled:shadow-none disabled:hover:scale-100 disabled:cursor-not-allowed"
          >
            {adding
              ? "Adding…"
              : inStock
              ? "Add to Cart"
              : "Notify Me When Available"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
