"use client";

import { useEffect, useState } from "react";
import { Package, ShoppingCart, Users, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

interface Stats {
  total_users: number;
  total_orders: number;
  total_products: number;
  total_revenue: number;
  low_stock_products: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("zenvyra_token");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}`}/api/admin/stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: "Total Revenue",
      value: stats ? `$${Number(stats.total_revenue).toFixed(2)}` : "-",
      icon: ShoppingCart,
      color: "text-emerald-400",
      bg: "bg-emerald-400/10",
    },
    {
      title: "Total Orders",
      value: stats ? stats.total_orders.toString() : "-",
      icon: Package,
      color: "text-blue-400",
      bg: "bg-blue-400/10",
    },
    {
      title: "Total Products",
      value: stats ? stats.total_products.toString() : "-",
      icon: Package,
      color: "text-[#A78BFA]",
      bg: "bg-[#A78BFA]/10",
    },
    {
      title: "Low Stock Items",
      value: stats ? stats.low_stock_products.toString() : "-",
      icon: AlertTriangle,
      color: "text-amber-400",
      bg: "bg-amber-400/10",
    },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-[#F9FAFB]">Dashboard Overview</h1>
        <p className="text-[#9CA3AF] mt-1">Metrics and status of the Zenvyra platform.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-[#1A1D24] rounded-2xl animate-pulse border border-white/[0.04]" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                className="bg-[#1A1D24] border border-white/[0.04] p-6 rounded-2xl flex flex-col justify-between shadow-soft relative overflow-hidden group"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-[#9CA3AF]">{card.title}</p>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.bg}`}>
                    <Icon className={`w-5 h-5 ${card.color}`} />
                  </div>
                </div>
                <h3 className="text-3xl font-bold text-[#F9FAFB] tracking-tight">{card.value}</h3>
                
                {/* Subtle hover gradient */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
