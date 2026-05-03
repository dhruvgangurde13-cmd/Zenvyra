'use client';

import { motion } from 'framer-motion';

export type ZenoVariant = 'happy' | 'sad' | 'success';

interface ZenoProps {
  variant?: ZenoVariant;
  className?: string;
}

export function Zeno({ variant = 'happy', className = '' }: ZenoProps) {
  const floatingAnimation = {
    y: [0, -10, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'easeInOut' as const,
    },
  };

  const bouncingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 0.8,
      repeat: Infinity,
      ease: 'anticipate' as const,
    },
  };

  const getAnimation = () => {
    if (variant === 'success') return bouncingAnimation;
    return floatingAnimation;
  };

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      animate={getAnimation()}
    >
      <svg
        viewBox="0 0 200 240"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        /* ── Glow halo so Zeno pops on any background ── */
        style={{ filter: 'drop-shadow(0 0 28px rgba(167,139,250,0.35)) drop-shadow(0 4px 12px rgba(255,253,249,0.15))' }}
      >
        {/* Ground shadow */}
        <ellipse cx="100" cy="225" rx="55" ry="8" fill="rgba(255,253,249,0.08)" />

        {/* ── Left Ear ── fixed pastel fill, NOT inheriting theme */}
        <path
          d="M60 110 C 20 60, 40 10, 75 40 C 95 60, 80 90, 60 110"
          fill="#FFFDF9"
          stroke="#E5E0D8"
          strokeWidth="3"
        />
        <path
          d="M60 100 C 35 65, 50 30, 72 50 C 85 65, 75 85, 60 100"
          fill="#EDE9FE"
        />

        {/* ── Right Ear ── */}
        <path
          d="M140 110 C 180 60, 160 10, 125 40 C 105 60, 120 90, 140 110"
          fill="#FFFDF9"
          stroke="#E5E0D8"
          strokeWidth="3"
        />
        <path
          d="M140 100 C 165 65, 150 30, 128 50 C 115 65, 125 85, 140 100"
          fill="#EDE9FE"
        />

        {/* ── Body ── warm cream, always light */}
        <path
          d="M30 150 C 30 90, 170 90, 170 150 C 170 210, 140 220, 100 220 C 60 220, 30 210, 30 150 Z"
          fill="#FFFDF9"
          stroke="#E5E0D8"
          strokeWidth="4"
        />

        {/* Cheek blush — soft purple */}
        {variant !== 'sad' && (
          <>
            <circle cx="65" cy="160" r="12" fill="#EEDCF0" opacity="0.6" />
            <circle cx="135" cy="160" r="12" fill="#EEDCF0" opacity="0.6" />
          </>
        )}

        {/* ── Eyes ── always dark for contrast against light body */}
        {variant === 'sad' ? (
          <>
            <circle cx="75" cy="148" r="5" fill="#4B5563" />
            <circle cx="125" cy="148" r="5" fill="#4B5563" />
            <path d="M68 135 L 82 140" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
            <path d="M132 135 L 118 140" stroke="#4B5563" strokeWidth="3" strokeLinecap="round" />
          </>
        ) : variant === 'success' ? (
          <>
            <path d="M68 145 Q 75 137 82 145" fill="none" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
            <path d="M118 145 Q 125 137 132 145" fill="none" stroke="#4B5563" strokeWidth="4" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="75" cy="145" r="5" fill="#4B5563" />
            <circle cx="125" cy="145" r="5" fill="#4B5563" />
          </>
        )}

        {/* ── Mouth ── */}
        {variant === 'sad' ? (
          <path
            d="M90 168 Q 100 162 110 168"
            fill="none"
            stroke="#4B5563"
            strokeWidth="3"
            strokeLinecap="round"
          />
        ) : variant === 'success' ? (
          <path
            d="M90 155 Q 100 175 110 155"
            fill="#FFFDF9"
            stroke="#4B5563"
            strokeWidth="3"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M92 160 Q 100 168 108 160"
            fill="none"
            stroke="#4B5563"
            strokeWidth="3"
            strokeLinecap="round"
          />
        )}

        {/* Purple belly accent */}
        <path d="M85 200 C 95 205, 105 205, 115 200" fill="none" stroke="#A78BFA" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
      </svg>

      {/* Confetti for success */}
      {variant === 'success' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute top-[10%] left-[20%] w-2 h-2 bg-purple-400 rounded-full animate-ping" />
          <div className="absolute top-[30%] right-[15%] w-3 h-3 bg-pink-400 rotate-45" />
          <div className="absolute top-[50%] left-[5%] w-2 h-2 bg-yellow-400 rounded-sm rotate-12" />
          <div className="absolute top-[20%] right-[30%] w-2 h-2 bg-indigo-400 rounded-full animate-bounce" />
        </motion.div>
      )}
    </motion.div>
  );
}
