"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Zeno } from "@/components/Zeno";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = checking
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("zenvyra_token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("username", email);
      formData.append("password", password);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/auth/login`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.data.access_token) {
        const token = data.data.access_token;
        localStorage.setItem("zenvyra_token", token);
        
        // Fetch user data to check if admin
        try {
          const userRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/auth/me`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          const userData = await userRes.json();
          if (userData.success && userData.data.is_admin) {
            router.push("/admin");
          } else {
            router.push("/products");
          }
        } catch (e) {
          router.push("/products");
        }
      } else {
        toast.error(data.detail || "Login failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("zenvyra_token");
    setIsLoggedIn(false);
  };

  // Still checking auth state
  if (isLoggedIn === null) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center h-[80vh]">
        <div className="w-full max-w-md bg-[#1A1D24] p-8 rounded-3xl shadow-soft border border-white/[0.06] animate-pulse h-64" />
      </div>
    );
  }

  // ── Already logged in state ──
  if (isLoggedIn) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center items-center h-[80vh]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md bg-[#1A1D24] p-8 rounded-3xl shadow-soft border border-white/[0.06] text-center"
        >
          <div className="flex justify-center mb-5">
            <Zeno variant="happy" className="w-32 h-32" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-[#F9FAFB] mb-2">
            You&apos;re already logged in
          </h1>
          <p className="text-[#6B7280] mb-8 text-[14px]">
            Welcome back! What would you like to do?
          </p>

          <div className="space-y-3">
            <Link
              href="/products"
              className="block w-full h-12 bg-[#A78BFA] text-white rounded-xl font-medium
                shadow-[0_4px_20px_-4px_rgba(167,139,250,0.4)] hover:bg-[#B9A0FF] transition-all
                flex items-center justify-center"
            >
              Continue Shopping
            </Link>

            <button
              onClick={handleLogout}
              className="w-full h-12 rounded-xl font-medium text-[#9CA3AF] border border-white/[0.08]
                bg-transparent hover:bg-white/[0.04] hover:text-[#F9FAFB] transition-all"
            >
              Logout
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Login form ──
  return (
    <div className="container mx-auto px-4 py-20 flex justify-center items-center h-[80vh]">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#1A1D24] p-8 rounded-3xl shadow-soft border border-white/[0.06]"
      >
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-[#F9FAFB]">Sign In</h1>
        <p className="text-[#6B7280] mb-8">Enter your credentials to continue.</p>
        
        <form onSubmit={handleLogin} className="space-y-4">
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
            {loading ? "Authenticating..." : "Login to Zenvyra"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-[#6B7280]">
          New to Zenvyra? <Link href="/register" className="text-[#A78BFA] font-medium hover:underline">Create an account</Link>
        </div>
      </motion.div>
    </div>
  );
}
