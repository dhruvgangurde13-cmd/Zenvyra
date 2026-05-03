"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Zeno } from "@/components/Zeno";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdmin = async () => {
      const token = localStorage.getItem("zenvyra_token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const res = await fetch("http://127.0.0.1:8000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          router.push("/login");
          return;
        }

        const data = await res.json();
        if (data.success && data.data.is_admin) {
          setIsAdmin(true);
        } else {
          router.push("/");
        }
      } catch (error) {
        console.error("Failed to verify admin status", error);
        router.push("/");
      }
    };

    checkAdmin();
  }, [router]);

  if (isAdmin === null) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#0B0F1A]">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-[#A78BFA]/20 border-t-[#A78BFA] rounded-full animate-spin mb-4" />
          <p className="text-[#6B7280] text-sm">Verifying access...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
