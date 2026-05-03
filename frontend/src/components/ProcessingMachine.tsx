'use client';

import { motion, useAnimationControls } from 'framer-motion';
import { useEffect, useState, useCallback } from 'react';

/**
 * ProcessingMachine — a box enters from the LEFT, travels through the machine,
 * pauses inside for processing, transforms, then exits to the RIGHT.
 *
 * Uses pixel-based keyframes for real physical movement across the machine.
 */
export function ProcessingMachine() {
  const boxControls = useAnimationControls();
  const glowControls = useAnimationControls();
  const [phase, setPhase] = useState<'idle' | 'entering' | 'processing' | 'exiting'>('idle');

  const runLoop = useCallback(async () => {
    let cancelled = false;

    const cycle = async () => {
      while (!cancelled) {
        // ── Reset: box starts far left, invisible ──
        boxControls.set({ x: -160, opacity: 0, scale: 0.95 });
        setPhase('idle');
        await sleep(800);
        if (cancelled) break;

        // ── Phase 1: ENTER — slide from left into center ──
        setPhase('entering');
        await boxControls.start({
          x: 0,
          opacity: 1,
          scale: 1,
          transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1] },
        });
        if (cancelled) break;

        // ── Phase 2: PROCESS — pause at center, glow + pulse ──
        setPhase('processing');
        glowControls.start({
          boxShadow: [
            'inset 0 0 20px rgba(167,139,250,0.04)',
            'inset 0 0 80px rgba(167,139,250,0.25)',
            'inset 0 0 20px rgba(167,139,250,0.04)',
          ],
          transition: { duration: 0.8, ease: 'easeInOut' as const },
        });
        await boxControls.start({
          scale: [1, 1.06, 1],
          transition: { duration: 0.7, ease: 'easeInOut' as const },
        });
        if (cancelled) break;

        // ── Phase 3: EXIT — slide out to the right ──
        setPhase('exiting');
        await boxControls.start({
          x: 160,
          opacity: [1, 1, 0],
          transition: { duration: 1.2, ease: [0.4, 0, 0.2, 1] },
        });
        if (cancelled) break;
      }
    };

    cycle();
    return () => { cancelled = true; };
  }, [boxControls, glowControls]);

  useEffect(() => {
    const cleanup = runLoop();
    return () => { cleanup.then?.(fn => fn?.()); };
  }, [runLoop]);

  // Box visual state: transforms from plain → branded during exit
  const isBranded = phase === 'exiting';

  return (
    <motion.div
      className="w-full max-w-lg rounded-3xl h-48 mt-28 relative border border-white/[0.06] z-10 overflow-hidden
        bg-[#1A1D24] shadow-[0_16px_48px_-12px_rgba(0,0,0,0.5)]"
      initial={{ y: 10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.3 }}
    >
      {/* ═══ LAYER 1: Background glow ═══ */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none z-0"
        animate={glowControls}
        initial={{ boxShadow: 'inset 0 0 20px rgba(167,139,250,0.04)' }}
      />

      {/* ── Left entry slot ── */}
      <div className="absolute left-0 top-[42%] -translate-y-1/2 w-[3px] h-8 rounded-r-full bg-[#A78BFA]/25 z-0" />

      {/* ── Right exit slot ── */}
      <div className="absolute right-0 top-[42%] -translate-y-1/2 w-[3px] h-8 rounded-l-full bg-[#A78BFA]/25 z-0" />

      {/* ── Faint center track line ── */}
      <div className="absolute left-6 right-6 top-[42%] h-px bg-white/[0.03] z-0" />

      {/* ═══ LAYER 2: Traveling box (center track) ═══ */}
      <motion.div
        className="absolute top-[42%] left-1/2 -translate-y-1/2 z-10"
        style={{ marginLeft: -14 }}
        animate={boxControls}
        initial={{ x: -160, opacity: 0, scale: 0.95 }}
      >
        <div
          className={`
            w-7 h-7 rounded-lg flex items-center justify-center
            transition-colors transition-shadow duration-300
            ${isBranded
              ? 'bg-[#A78BFA]/20 border border-[#A78BFA]/50 shadow-[0_0_16px_-2px_rgba(167,139,250,0.4)]'
              : 'bg-[#3A3F4A] border border-white/[0.08]'
            }
          `}
        >
          {isBranded ? (
            <span className="text-[10px] font-bold text-[#A78BFA] select-none leading-none">
              Z
            </span>
          ) : (
            <div className="w-3 h-3 rounded bg-[#4A4F5A]" />
          )}
        </div>
      </motion.div>

      {/* ═══ LAYER 3: Status label (bottom zone, above box) ═══ */}
      <div className="absolute bottom-5 left-0 right-0 flex justify-center z-20 pointer-events-none select-none">
        <div className="flex items-center gap-3 bg-[#15171C] border border-white/[0.06] rounded-full px-4 py-1.5">
          <span className="text-[9px] font-mono text-[#A78BFA] tracking-[0.18em] font-semibold uppercase">
            {phase === 'processing' ? 'Processing' : phase === 'exiting' ? 'Complete' : 'Ready'}
          </span>
          <div className="flex gap-1.5">
            {[0, 0.15, 0.3].map((delay, i) => (
              <motion.div
                key={i}
                className="w-5 h-1 bg-[#A78BFA] rounded-full"
                animate={{
                  opacity: phase === 'processing' ? [0.15, 1, 0.15] : phase === 'exiting' ? 0.9 : 0.15,
                }}
                transition={{
                  duration: phase === 'processing' ? 0.5 : 0.3,
                  repeat: phase === 'processing' ? Infinity : 0,
                  delay: phase === 'processing' ? delay : 0,
                  ease: 'easeInOut' as const,
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}
