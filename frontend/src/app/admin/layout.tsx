"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { AdminGuard } from "@/components/AdminGuard";
import { LayoutDashboard, Package, ShoppingCart, LogOut, ArrowLeft, Menu, X } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("zenvyra_token");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-[#0B0F1A] flex">
        {/* Sidebar */}
        <aside className="w-64 border-r border-white/[0.04] bg-[#0B0F1A]/80 backdrop-blur-xl flex flex-col hidden md:flex relative z-10">
          <div className="p-6 border-b border-white/[0.04]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#A78BFA] flex items-center justify-center text-white font-bold tracking-tighter">
                Z
              </div>
              <div>
                <h2 className="text-[#F9FAFB] font-semibold text-sm tracking-tight">Zenvyra Admin</h2>
                <p className="text-[#6B7280] text-xs">Management Portal</p>
              </div>
            </div>
          </div>

          <div className="flex-1 px-4 py-6 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive 
                      ? "bg-[#A78BFA]/10 text-[#A78BFA]" 
                      : "text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/[0.02]"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </div>

          <div className="p-4 border-t border-white/[0.04] space-y-2">
            <Link 
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/[0.02] transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Store
            </Link>
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all text-left"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </aside>

        {/* Mobile Header */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 border-b border-white/[0.04] bg-[#0B0F1A]/95 backdrop-blur-xl flex items-center justify-between px-4 z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#A78BFA] flex items-center justify-center text-white font-bold tracking-tighter">
              Z
            </div>
            <h2 className="text-[#F9FAFB] font-semibold text-sm tracking-tight">Admin</h2>
          </div>
          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-[#9CA3AF]">
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed top-16 left-0 right-0 bottom-0 bg-[#0B0F1A]/95 backdrop-blur-3xl z-40 p-4 flex flex-col overflow-y-auto">
            <div className="flex-1 space-y-2 mt-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium transition-all ${
                      isActive 
                        ? "bg-[#A78BFA]/10 text-[#A78BFA]" 
                        : "text-[#9CA3AF] hover:text-[#F9FAFB] hover:bg-white/[0.02]"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
            <div className="mt-8 space-y-2 border-t border-white/[0.04] pt-4">
              <Link 
                href="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium text-[#9CA3AF] hover:text-[#F9FAFB] bg-white/[0.02] transition-all"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Store
              </Link>
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-4 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 bg-red-400/10 transition-all text-left"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative min-h-screen overflow-y-auto">
          {/* Subtle top glow in main area */}
          <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#A78BFA]/[0.03] to-transparent pointer-events-none z-0" />
          
          <div className="p-4 pt-20 sm:p-6 md:p-10 relative z-10">
            {children}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
