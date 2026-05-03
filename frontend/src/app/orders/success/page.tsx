"use client";

import { Zeno } from "@/components/Zeno";
import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

export default function OrderSuccessPage() {
  useEffect(() => {
    toast.success("Payment verified successfully!");
  }, []);

  return (
    <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Zeno variant="success" className="w-64 h-64" />
        <motion.h1 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="text-4xl font-bold mt-8 mb-4 tracking-tight text-[#F9FAFB]"
        >
            Order Successful
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="text-[#9CA3AF] mb-8 max-w-md">
            Your flow state essentials are being prepared. Zeno is hopping on it! You will receive a tracking link shortly.
        </motion.p>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          <Link 
            href="/products"
            className="inline-flex h-12 items-center justify-center rounded-full bg-[#A78BFA] px-8 text-sm font-medium text-white shadow-[0_4px_20px_-4px_rgba(167,139,250,0.4)] transition-all hover:bg-[#B9A0FF] hover:scale-[1.02] active:scale-[0.98]"
          >
              Continue Shopping
          </Link>
        </motion.div>
    </div>
  );
}
