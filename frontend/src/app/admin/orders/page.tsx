"use client";

import React, { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Package } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  product: {
    title: string;
  };
}

interface Order {
  id: string;
  total_amount: number;
  status: string;
  created_at: string;
  user: {
    email: string;
  };
  items: OrderItem[];
}

const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
  PENDING: { bg: "bg-amber-500/10", text: "text-amber-400", label: "Pending" },
  PAID: { bg: "bg-emerald-500/10", text: "text-emerald-400", label: "Paid" },
  FAILED: { bg: "bg-red-500/10", text: "text-red-400", label: "Failed" },
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("zenvyra_token");
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/orders/admin/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[#F9FAFB]">Orders</h1>
        <p className="text-[#9CA3AF] mt-1">View and manage customer orders.</p>
      </div>

      <div className="bg-[#1A1D24] border border-white/[0.04] rounded-2xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/[0.04] bg-white/[0.01]">
                <th className="py-4 px-6 text-sm font-medium text-[#9CA3AF] w-12"></th>
                <th className="py-4 px-6 text-sm font-medium text-[#9CA3AF]">Order ID</th>
                <th className="py-4 px-6 text-sm font-medium text-[#9CA3AF]">Customer</th>
                <th className="py-4 px-6 text-sm font-medium text-[#9CA3AF]">Date</th>
                <th className="py-4 px-6 text-sm font-medium text-[#9CA3AF]">Status</th>
                <th className="py-4 px-6 text-sm font-medium text-[#9CA3AF] text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6B7280]">Loading orders...</td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-[#6B7280]">No orders found.</td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isExpanded = expandedRows.has(order.id);
                  const badge = statusStyles[order.status] || statusStyles.PENDING;
                  const date = new Date(order.created_at);

                  return (
                    <React.Fragment key={order.id}>
                      <tr 
                        onClick={() => toggleRow(order.id)}
                        className={`hover:bg-white/[0.01] transition-colors cursor-pointer ${isExpanded ? "bg-white/[0.01]" : ""}`}
                      >
                        <td className="py-4 px-6 text-[#6B7280]">
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-mono text-sm text-[#D1D5DB]">{order.id.split('-')[0]}</span>
                        </td>
                        <td className="py-4 px-6 text-sm text-[#F9FAFB]">{order.user.email}</td>
                        <td className="py-4 px-6 text-sm text-[#9CA3AF]">
                          {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.text}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm font-medium text-[#F9FAFB] text-right">
                          ${Number(order.total_amount).toFixed(2)}
                        </td>
                      </tr>
                      
                      {/* Expanded Items Row */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan={6} className="p-0 border-b-0">
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-[#0B0F1A]/50"
                              >
                                <div className="p-6 pl-16">
                                  <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">Order Items</h4>
                                  <div className="space-y-3">
                                    {order.items.map((item) => (
                                      <div key={item.id} className="flex items-center justify-between max-w-2xl bg-[#1A1D24] p-3 rounded-xl border border-white/[0.02]">
                                        <div className="flex items-center gap-3">
                                          <div className="w-8 h-8 rounded bg-[#22262F] flex items-center justify-center">
                                            <Package className="w-4 h-4 text-[#6B7280]" />
                                          </div>
                                          <p className="text-sm font-medium text-[#D1D5DB]">{item.product.title}</p>
                                        </div>
                                        <div className="flex items-center gap-8 text-sm">
                                          <span className="text-[#9CA3AF]">Qty: {item.quantity}</span>
                                          <span className="text-[#F9FAFB] font-medium min-w-[60px] text-right">
                                            ${(Number(item.price_at_purchase) * item.quantity).toFixed(2)}
                                          </span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
