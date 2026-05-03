import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Zenvyra",
  icons: {
    icon: [
      { url: "/zeno-icon.svg", type: "image/svg+xml" },
      { url: "/zeno-icon.png", type: "image/png" },
    ],
    apple: "/zeno-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`antialiased min-h-screen flex flex-col bg-[#0B0F1A]`}>
        <Toaster position="top-center" richColors theme="dark" />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <footer className="py-12 border-t border-white/[0.06] text-center text-sm text-[#6B7280] mt-20">
          <p>© 2026 Zenvyra. All rights reserved.</p>
        </footer>
      </body>
    </html>
  );
}
