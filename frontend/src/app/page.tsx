"use client";

import { Zeno } from "@/components/Zeno";
import { ProcessingMachine } from "@/components/ProcessingMachine";
import { ProductImage } from "@/components/ProductImage";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  title: string;
  price: number;
  category: string;
  image_url: string | null;
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/products`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          // Show first 3 in-stock products as featured
          const inStock = data.data.items.filter((p: Product & { stock: number }) => p.stock > 0);
          setProducts(inStock.slice(0, 3));
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="relative overflow-hidden vignette">
      {/* ═══ Ultra-premium atmospheric layers ═══ */}

      {/* Layer 1: Primary purple glow — drifts slowly behind mascot area */}
      <div
        className="absolute top-[-15%] right-[-10%] w-[80vw] h-[100vh] pointer-events-none z-0 ambient-drift"
        style={{
          background: "radial-gradient(ellipse 55% 50% at 50% 45%, rgba(167,139,250,0.14) 0%, rgba(139,92,246,0.06) 35%, transparent 65%)",
        }}
      />

      {/* Layer 2: Warm accent glow — counter-drifts at bottom-left */}
      <div
        className="absolute bottom-[-20%] left-[-15%] w-[70vw] h-[80vh] pointer-events-none z-0 ambient-drift-reverse"
        style={{
          background: "radial-gradient(ellipse 50% 45% at 50% 50%, rgba(96,165,250,0.07) 0%, rgba(59,130,246,0.03) 40%, transparent 65%)",
        }}
      />

      {/* Layer 3: Vertical gradient — warm top, deep bottom */}
      <div
        className="absolute inset-0 pointer-events-none z-0"
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, transparent 25%, transparent 70%, rgba(0,0,0,0.25) 100%)",
        }}
      />

      {/* ═══ Page content ═══ */}
      <div className="relative z-10 container mx-auto px-4 pt-10 pb-8 md:pt-20 md:pb-12">
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between min-h-auto py-12 md:py-0 md:min-h-[70vh] gap-12 md:gap-20">

        {/* ── LEFT: Text ── */}
        <div className="flex-1 max-w-xl space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl sm:text-6xl md:text-[80px] font-bold tracking-[-0.04em] leading-[0.95] text-[#F9FAFB]"
          >
            Curated products,{" "}
            <span className="text-[#A78BFA]">delivered with precision.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-[17px] text-[#9CA3AF] max-w-md leading-relaxed pt-2"
          >
            From discovery to doorstep — effortlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="pt-2"
          >
            <Link 
              href="/products" 
              className="inline-flex h-14 w-full md:w-auto items-center justify-center rounded-full bg-[#A78BFA] px-10 text-[15px] font-semibold text-white
                shadow-[0_4px_20px_-4px_rgba(167,139,250,0.5)] transition-all duration-300
                hover:bg-[#B9A0FF] hover:shadow-[0_8px_30px_-4px_rgba(167,139,250,0.6)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Shop Collection
            </Link>
          </motion.div>
        </div>
        
        {/* ── RIGHT: Visual Scene ── */}
        <div className="relative w-full max-w-[520px] aspect-square md:aspect-auto md:h-[560px] flex items-center justify-center">

          {/* Zeno spotlight — soft pulsing glow source behind the mascot */}
          <div
            className="absolute top-[18%] left-1/2 w-[320px] h-[320px] pointer-events-none z-0"
            style={{
              animation: "zenoPulse 6s ease-in-out infinite",
              background: "radial-gradient(circle at 50% 50%, rgba(167,139,250,0.22) 0%, rgba(139,92,246,0.08) 40%, transparent 70%)",
              transform: "translate(-50%, -50%)",
              filter: "blur(30px)",
            }}
          />

          {/* Scene ambient fill — subtle secondary glow */}
          <div
            className="absolute inset-0 rounded-[40px] pointer-events-none z-0"
            style={{ background: "radial-gradient(ellipse 70% 60% at 50% 40%, rgba(167,139,250,0.06) 0%, transparent 65%)" }}
          />

          {/* Zeno — glow handled inside component */}
          <div className="absolute z-20 top-[2%] md:top-[8%]">
            <Zeno variant="happy" className="w-64 h-64" />
          </div>
          
          {/* The Processing Machine — unified animation component */}
          <ProcessingMachine />
        </div>
      </section>
      
      {/* Best Sellers Preview — fetched from API */}
      <section className="mt-32">
        <div className="flex items-baseline justify-between mb-10">
          <h2 className="text-[28px] font-semibold tracking-[-0.01em] text-[#F9FAFB]">The Essentials</h2>
          <Link href="/products" className="text-[13px] font-medium text-[#6B7280] hover:text-white transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          {products.length > 0
            ? products.map((p) => (
                <Link key={p.id} href={`/products/${p.id}`} className="group flex flex-col card-lift rounded-2xl cursor-pointer">
                  <div className="mb-4">
                    <ProductImage
                      src={p.image_url}
                      alt={p.title}
                      category={p.category}
                    />
                  </div>
                  <div className="px-1">
                    <h3 className="font-semibold text-[15px] tracking-[-0.01em] text-[#F9FAFB]">{p.title}</h3>
                    <span className="font-medium text-[15px] text-[#9CA3AF] mt-1 block">${p.price}</span>
                  </div>
                </Link>
              ))
            : /* Skeleton placeholders while loading */
              [1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col">
                  <div className="aspect-[3/4] w-full bg-[#1A1D24] rounded-2xl mb-4 animate-pulse" />
                  <div className="h-4 w-3/4 bg-[#1A1D24] rounded-lg animate-pulse mb-2" />
                  <div className="h-4 w-16 bg-[#1A1D24] rounded-lg animate-pulse" />
                </div>
              ))
          }
        </div>
      </section>
    </div>
    </div>
  );
}
