"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("http://127.0.0.1:8000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Account created. Please log in.");
        router.push("/login");
      } else {
        toast.error(data.detail || "Registration failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#1A1D24] p-8 rounded-3xl shadow-soft border border-white/[0.06]"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#F9FAFB]">Join Zenvyra.</h1>
        <p className="text-[#6B7280] mb-8">Equip your essential workspace today.</p>
        
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-[#9CA3AF]">Email</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-3 rounded-xl bg-[#22262F] border border-white/[0.06] text-[#F9FAFB] placeholder-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50 transition-all"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-[#9CA3AF]">Password</label>
            <input 
              type="password"
              required
              className="w-full px-4 py-3 rounded-xl bg-[#22262F] border border-white/[0.06] text-[#F9FAFB] placeholder-[#4B5563] focus:outline-none focus:ring-2 focus:ring-[#A78BFA]/50 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full h-12 bg-[#A78BFA] text-white rounded-xl font-medium shadow-[0_4px_20px_-4px_rgba(167,139,250,0.4)] hover:bg-[#B9A0FF] transition-all disabled:opacity-50 mt-4"
          >
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#6B7280]">
          Already have an account? <Link href="/login" className="text-[#A78BFA] font-medium hover:underline">Sign in</Link>
        </div>
      </motion.div>
    </div>
  );
}
