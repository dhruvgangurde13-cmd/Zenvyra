"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingBag, User as UserIcon, Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b border-white/[0.06] backdrop-blur-xl bg-[#0B0F1A]/80">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-bold text-xl tracking-tight text-[#F9FAFB]">
            Zenvyra.
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-[#9CA3AF]">
            <Link href="/products" className="hover:text-white transition-colors">
              Shop
            </Link>
            <Link href="/orders" className="hover:text-white transition-colors">
              Orders
            </Link>
            <Link href="/login" className="hover:text-white transition-colors">
              <UserIcon className="w-5 h-5" />
            </Link>
            <Link href="/cart" className="hover:text-white transition-colors">
              <ShoppingBag className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Nav Toggle */}
          <button
            className="md:hidden p-2 text-[#9CA3AF] hover:text-white transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="fixed top-16 left-0 right-0 z-40 bg-[#0B0F1A]/95 backdrop-blur-2xl border-b border-white/[0.06] overflow-hidden md:hidden"
          >
            <div className="flex flex-col px-4 py-6 space-y-4">
              <Link
                href="/products"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center h-14 px-4 rounded-2xl bg-white/[0.03] text-[15px] font-medium text-[#F9FAFB] hover:bg-white/[0.06] transition-colors"
              >
                Shop Collection
              </Link>
              <Link
                href="/orders"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center h-14 px-4 rounded-2xl bg-white/[0.03] text-[15px] font-medium text-[#F9FAFB] hover:bg-white/[0.06] transition-colors"
              >
                My Orders
              </Link>
              <div className="flex gap-4 pt-2">
                <Link
                  href="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 flex justify-center items-center h-14 rounded-2xl bg-white/[0.03] text-[#F9FAFB] hover:bg-white/[0.06] transition-colors gap-2 font-medium"
                >
                  <UserIcon className="w-5 h-5" /> Account
                </Link>
                <Link
                  href="/cart"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex-1 flex justify-center items-center h-14 rounded-2xl bg-[#A78BFA] text-white hover:bg-[#B9A0FF] shadow-[0_4px_20px_-4px_rgba(167,139,250,0.4)] transition-all gap-2 font-medium"
                >
                  <ShoppingBag className="w-5 h-5" /> Cart
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
