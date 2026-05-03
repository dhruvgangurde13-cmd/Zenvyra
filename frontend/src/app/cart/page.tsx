"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Zeno } from "@/components/Zeno";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface CartItem {
  id: string;
  quantity: number;
  product: {
    id: string;
    title: string;
    price: number;
    stock: number;
  };
}

export default function CartCheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutState, setCheckoutState] = useState<"idle" | "processing">("idle");
  const [busyItemId, setBusyItemId] = useState<string | null>(null);
  const router = useRouter();

  const getToken = () => localStorage.getItem("zenvyra_token");

  const fetchCart = useCallback(async () => {
    const token = getToken();
    if (!token) {
      router.push("/login");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) setItems(data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /* ---- Quantity update ---- */
  const updateQuantity = async (itemId: string, newQty: number) => {
    const token = getToken();
    if (!token) return;
    setBusyItemId(itemId);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/cart/items/${itemId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ quantity: newQty }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setItems((prev) =>
          prev.map((it) =>
            it.id === itemId ? { ...it, quantity: newQty } : it
          )
        );
      } else {
        toast.error(data.detail || "Could not update quantity.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusyItemId(null);
    }
  };

  /* ---- Remove item ---- */
  const removeItem = async (itemId: string) => {
    const token = getToken();
    if (!token) return;
    setBusyItemId(itemId);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/cart/items/${itemId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await res.json();
      if (data.success) {
        setItems((prev) => prev.filter((it) => it.id !== itemId));
        toast.success("Item removed.");
      } else {
        toast.error(data.detail || "Could not remove item.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBusyItemId(null);
    }
  };

  /* ---- Checkout ---- */
  const simulateCheckout = async () => {
    const token = getToken();
    if (!token) return;

    setCheckoutState("processing");

    try {
      const orderRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/orders/checkout`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const orderData = await orderRes.json();

      if (!orderData.success) {
        toast.error(orderData.detail || "Unable to process order.");
        setCheckoutState("idle");
        return;
      }

      const orderId = orderData.data.id;
      const razorpayOrderId = orderData.data.razorpay_order_id;

      await new Promise((r) => setTimeout(r, 2000));

      const verifyRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/orders/${orderId}/verify`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            razorpay_order_id: razorpayOrderId,
            razorpay_payment_id:
              "pay_mock_" + Math.random().toString(36).substring(7),
            razorpay_signature: "mock_signature_valid",
          }),
        }
      );

      const verifyData = await verifyRes.json();
      if (verifyData.success) {
        setItems([]);
        router.push("/orders/success");
      } else {
        toast.error("Verification failed. Please try again.");
        setCheckoutState("idle");
      }
    } catch (err) {
      console.error(err);
      setCheckoutState("idle");
    }
  };

  const total = items.reduce(
    (acc, cur) => acc + cur.product.price * cur.quantity,
    0
  );

  /* ---------- loading ---------- */
  if (loading) {
    return (
      <div className="container mx-auto max-w-5xl px-4 pt-8 pb-16 md:pt-16 md:pb-24">
        <div className="h-10 w-40 bg-[#1A1D24] rounded-xl animate-pulse mb-10" />
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-28 bg-[#1A1D24] rounded-2xl animate-pulse mb-4"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-5xl">
      <h1 className="text-2xl md:text-[32px] font-bold tracking-[-0.02em] text-[#F9FAFB] mb-8 md:mb-10">
        Your Cart
      </h1>

      <div className="flex flex-col lg:flex-row gap-12">
        {/* ---- Cart Items ---- */}
        <div className="flex-1 space-y-5">
          {items.length === 0 ? (
            <div className="p-12 text-center rounded-3xl bg-[#A78BFA]/5 border border-[#A78BFA]/15 flex flex-col items-center justify-center min-h-[300px]">
              <Zeno variant="sad" className="w-40 h-40 mb-4 opacity-80" />
              <h3 className="text-xl font-medium text-[#9CA3AF] mb-2">
                Your cart feels a bit light.
              </h3>
              <p className="text-[#A78BFA]/70">
                Zeno is waiting to carry your items!
              </p>
            </div>
          ) : (
            items.map((item) => {
              const isBusy = busyItemId === item.id;
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: isBusy ? 0.6 : 1, y: 0 }}
                  exit={{ opacity: 0, x: -40 }}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-5 p-4 sm:p-5 rounded-2xl border border-white/[0.06] bg-[#1A1D24] shadow-soft"
                >
                  {/* Item Image / Details Row on Mobile */}
                  <div className="flex gap-4 sm:gap-5 flex-1">
                    {/* Monogram thumbnail */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#22262F] rounded-xl flex-shrink-0 flex items-center justify-center">
                      <span className="text-2xl sm:text-[32px] font-bold text-[#2A2E37] select-none">
                        {item.product.title.charAt(0)}
                      </span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 flex flex-col justify-center min-w-0">
                      <h3 className="font-semibold text-[15px] text-[#F9FAFB] truncate">
                        {item.product.title}
                      </h3>
                      <span className="text-[14px] font-medium text-[#6B7280] mt-0.5">
                        ${item.product.price}
                      </span>
                    </div>
                  </div>

                  {/* Actions Row on Mobile */}
                  <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 mt-2 sm:mt-0">
                    {/* Quantity controls */}
                    <div className="flex items-center gap-1 bg-white/[0.02] sm:bg-transparent rounded-full p-1 sm:p-0 border border-white/[0.05] sm:border-none">
                    <button
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.id, item.quantity - 1)
                          : removeItem(item.id)
                      }
                      disabled={isBusy}
                      className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center text-[#9CA3AF] hover:bg-white/[0.05] transition-colors disabled:opacity-40"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>

                    <span className="w-8 text-center text-[14px] font-medium text-[#F9FAFB]">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        updateQuantity(item.id, item.quantity + 1)
                      }
                      disabled={isBusy}
                      className="w-9 h-9 rounded-full border border-white/[0.1] flex items-center justify-center text-[#9CA3AF] hover:bg-white/[0.05] transition-colors disabled:opacity-40"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                    {/* Line total + remove */}
                    <div className="flex flex-col items-end justify-center py-1">
                      <span className="font-semibold text-[15px] text-[#F9FAFB]">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        disabled={isBusy}
                        className="text-[12px] text-[#6B7280] hover:text-[#F87171] transition-colors disabled:opacity-40 mt-1"
                        aria-label={`Remove ${item.product.title}`}
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        {/* ---- Summary ---- */}
        <div className="w-full lg:w-96">
          <div className="p-8 rounded-3xl bg-[#1A1D24] border border-white/[0.06] shadow-soft sticky top-24">
            <h2 className="text-xl font-bold text-[#F9FAFB] mb-6">Summary</h2>

            <div className="flex justify-between mb-3 text-[14px] text-[#9CA3AF]">
              <span>
                Items ({items.reduce((a, c) => a + c.quantity, 0)})
              </span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex justify-between mb-6 text-[14px] text-[#9CA3AF]">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="border-t border-white/[0.06] pt-4 mb-8 flex justify-between font-bold text-lg text-[#F9FAFB]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <div className="flex justify-center mb-6 h-16">
              {checkoutState === "processing" ? (
                <Zeno variant="happy" className="w-14 h-14" />
              ) : null}
            </div>

            <button
              disabled={items.length === 0 || checkoutState === "processing"}
              onClick={simulateCheckout}
              className="w-full h-14 rounded-full text-[14px] font-medium tracking-[0.01em] transition-all duration-300 ease-out
                bg-[#A78BFA] text-white hover:bg-[#B9A0FF] hover:scale-[1.01] active:scale-[0.99]
                shadow-[0_4px_20px_-4px_rgba(167,139,250,0.4)]
                disabled:bg-[#22262F] disabled:text-[#6B7280] disabled:shadow-none disabled:hover:scale-100 disabled:cursor-not-allowed
                flex items-center justify-center gap-2"
            >
              {checkoutState === "processing"
                ? "Verifying…"
                : "Simulate Payment"}
            </button>

            <p className="text-[11px] text-center text-[#6B7280] mt-4">
              Strict atomic product stock limits are enforced backend-side.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
