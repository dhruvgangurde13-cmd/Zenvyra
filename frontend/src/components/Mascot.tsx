"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export type MascotState = "idle" | "processing" | "success" | "hidden";

interface MascotProps {
  state?: MascotState;
  className?: string;
}

export function Mascot({ state = "idle", className }: MascotProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || state === "hidden") return null;

  const variants = {
    idle: {
      y: [0, -10, 0],
      rotate: [0, 1, -1, 0],
      transition: { repeat: Infinity, duration: 4, ease: "easeInOut" as const }
    },
    processing: {
      y: [0, 5, 0],
      x: [0, 5, 0],
      rotate: [0, -5, 0],
      transition: { repeat: Infinity, duration: 2, ease: "easeInOut" as const }
    },
    success: {
      y: [-20, 0, -10, 0],
      scale: [1, 1.1, 1],
      transition: { duration: 0.8, ease: "easeOut" as const }
    }
  };

  return (
    <div className={cn("relative flex items-center justify-center w-32 h-32", className)}>
      <motion.div
        variants={variants}
        animate={state}
        style={{
          width: 80,
          height: 80,
          borderRadius: "40px",
          background: "linear-gradient(135deg, var(--color-accent-blue), var(--color-accent-purple))",
          boxShadow: "0 0 40px rgba(167, 139, 250, 0.4)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative"
        }}
      >
        {/* Face */}
        <div className="flex gap-4">
          <motion.div 
            animate={{ scaleY: state === "success" ? [1, 0.2, 1] : 1 }}
            transition={{ repeat: state === "idle" ? Infinity : 0, repeatDelay: 3, duration: 0.2 }}
            className="w-2.5 h-2.5 rounded-full bg-white block" 
          />
          <motion.div 
            animate={{ scaleY: state === "success" ? [1, 0.2, 1] : 1 }}
            transition={{ repeat: state === "idle" ? Infinity : 0, repeatDelay: 3, duration: 0.2 }}
            className="w-2.5 h-2.5 rounded-full bg-white block" 
          />
        </div>
        {/* Smile for success */}
        {state === "success" && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute bottom-5 w-6 h-2 border-b-2 border-white rounded-b-full"
          />
        )}
      </motion.div>
    </div>
  );
}
