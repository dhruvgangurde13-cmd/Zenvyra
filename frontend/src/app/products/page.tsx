"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
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

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setProducts(data.data.items);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const addToCart = async (productId: string) => {
    const token = localStorage.getItem("zenvyra_token");
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/cart/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ product_id: productId, quantity: 1 })
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Added to cart!");
      } else {
        toast.error(data.detail || "Error adding to cart");
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto max-w-6xl px-4 pt-8 pb-16 md:pt-16 md:pb-24">
        <div className="mb-12">
          <div className="h-12 w-64 bg-[#1A1D24] rounded-2xl animate-pulse mb-4" />
          <div className="h-5 w-96 bg-[#1A1D24] rounded-xl animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="aspect-[3/4] w-full bg-[#1A1D24] rounded-2xl animate-pulse mb-4" />
              <div className="h-4 w-3/4 bg-[#1A1D24] rounded-lg animate-pulse mb-2" />
              <div className="h-4 w-16 bg-[#1A1D24] rounded-lg animate-pulse mb-2" />
              <div className="h-3 w-full bg-[#1A1D24] rounded-lg animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 pt-8 pb-16 md:pt-16 md:pb-24">
      {/* Page Header */}
      <div className="mb-12">
        <h1 className="text-3xl md:text-[40px] font-bold tracking-[-0.02em] text-[#F9FAFB] mb-3">Collection</h1>
        <p className="text-[15px] text-[#9CA3AF] max-w-xl leading-relaxed">
          Discover minimal tools designed to elevate your workspace and eliminate functional friction.
        </p>
        <p className="text-[13px] text-[#6B7280] mt-2">{products.length} products</p>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {products.map((p, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.5 }}
            key={p.id} 
            className="group flex flex-col card-lift rounded-2xl"
          >
            {/* Product Image Zone */}
            <Link href={`/products/${p.id}`} className="block">
              <ProductImage
                src={p.image_url}
                alt={p.title}
                category={p.category}
                soldOut={p.stock <= 0}
              />
            </Link>

            {/* Text Zone */}
            <div className="px-1 flex flex-col flex-1">
              <h3 className="font-semibold text-[15px] tracking-[-0.01em] text-[#F9FAFB]">{p.title}</h3>
              <span className="font-medium text-[15px] text-[#9CA3AF] mt-1">${p.price}</span>
              <p className="text-[13px] text-[#6B7280] leading-relaxed mt-1.5 line-clamp-1">{p.description}</p>
              
              {/* CTA Button */}
              <button 
                onClick={() => addToCart(p.id)}
                disabled={p.stock <= 0}
                className="mt-5 h-11 w-full rounded-full text-[13px] font-medium tracking-[0.01em] transition-all duration-300 ease-out
                  bg-[#A78BFA] text-white hover:bg-[#B9A0FF] hover:scale-[1.02] active:scale-[0.98]
                  shadow-[0_2px_12px_-3px_rgba(167,139,250,0.4)]
                  disabled:bg-[#1A1D24] disabled:text-[#6B7280] disabled:shadow-none disabled:hover:scale-100 disabled:cursor-not-allowed"
              >
                {p.stock > 0 ? "Add to Cart" : "Notify Me"}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
