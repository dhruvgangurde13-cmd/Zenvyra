"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zeno } from "@/components/Zeno";
import Link from "next/link";

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  product: {
    id: string;
    title: string;
    price: number;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  razorpay_order_id: string | null;
  items: OrderItem[];
  created_at: string;
}

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Pending" },
  PAID: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Paid" },
  FAILED: { bg: "bg-red-500/10", text: "text-red-400", label: "Failed" },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("zenvyra_token");
    if (!token) {
      router.push("/login");
      return;
    }

    fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setOrders(data.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [router]);

  /* ---------- loading ---------- */
  if (loading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 pt-16 pb-24">
        <div className="h-10 w-48 bg-[#1A1D24] rounded-xl animate-pulse mb-10" />
        {[1, 2, 3].map(i => (
          <div key={i} className="h-32 bg-[#1A1D24] rounded-2xl animate-pulse mb-4" />
        ))}
      </div>
    );
  }

  /* ---------- empty state ---------- */
  if (orders.length === 0) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-20 flex flex-col items-center justify-center min-h-[55vh] text-center">
        <Zeno variant="sad" className="w-44 h-44 mb-6 opacity-80" />
        <h2 className="text-xl font-semibold text-[#9CA3AF] mb-2">
          No orders yet
        </h2>
        <p className="text-[#6B7280] mb-8 max-w-sm">
          When you place an order, it will appear here. Zeno is eager to start delivering!
        </p>
        <Link
          href="/products"
          className="inline-flex h-12 items-center justify-center rounded-full bg-[#A78BFA] px-8 text-sm font-medium text-white shadow-[0_4px_20px_-4px_rgba(167,139,250,0.4)] transition-all hover:bg-[#B9A0FF] hover:scale-[1.02] active:scale-[0.98]"
        >
          Browse Collection
        </Link>
      </div>
    );
  }

  /* ---------- order list ---------- */
  return (
    <div className="container mx-auto max-w-4xl px-4 pt-16 pb-24">
      <h1 className="text-[32px] font-bold tracking-[-0.02em] text-[#F9FAFB] mb-2">
        Your Orders
      </h1>
      <p className="text-[14px] text-[#6B7280] mb-10">
        {orders.length} order{orders.length !== 1 ? "s" : ""}
      </p>

      <div className="space-y-5">
        {orders.map((order, i) => {
          const badge = statusStyles[order.status] ?? statusStyles.PENDING;
          const date = new Date(order.created_at);

          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
              className="rounded-2xl border border-white/[0.06] bg-[#1A1D24] p-6 shadow-soft"
            >
              {/* Header Row */}
              <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
                <div>
                  <p className="text-[13px] text-[#6B7280] mb-1">
                    {date.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                    {" · "}
                    {date.toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                  <p className="text-[12px] font-mono text-[#4B5563] truncate max-w-[220px]">
                    {order.id.slice(0, 8)}…
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={`text-[12px] font-semibold tracking-[0.04em] uppercase px-3 py-1 rounded-full ${badge.bg} ${badge.text}`}
                  >
                    {badge.label}
                  </span>
                  <span className="text-[18px] font-bold text-[#F9FAFB]">
                    ${Number(order.total_amount).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3">
                {order.items.map(item => (
                  <div
                    key={item.id}
                    className="flex items-center gap-4"
                  >
                    {/* mini monogram */}
                    <div className="w-10 h-10 rounded-lg bg-[#22262F] flex items-center justify-center flex-shrink-0">
                      <span className="text-[16px] font-bold text-[#2A2E37] select-none">
                        {item.product.title.charAt(0)}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-medium text-[#F9FAFB] truncate">
                        {item.product.title}
                      </p>
                    </div>

                    <span className="text-[13px] text-[#6B7280] whitespace-nowrap">
                      ×{item.quantity}
                    </span>

                    <span className="text-[14px] font-medium text-[#F9FAFB] whitespace-nowrap">
                      ${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
