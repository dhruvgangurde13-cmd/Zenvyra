'use client';

/**
 * ProductImage — shows a real product image with graceful fallback.
 *
 * If `src` exists → renders the image inside a gradient-backed container
 * with drop shadow, centered, and hover zoom.
 * If `src` is null/empty → renders a styled placeholder with a gradient icon.
 *
 * All colors are hardcoded (not inherited from theme) so it works on any surface.
 */

interface ProductImageProps {
  src: string | null | undefined;
  alt: string;
  /** Aspect ratio class, defaults to aspect-[3/4] */
  aspect?: string;
  /** Show category badge */
  category?: string;
  /** Show sold out badge */
  soldOut?: boolean;
}

export function ProductImage({
  src,
  alt,
  aspect = 'aspect-[3/4]',
  category,
  soldOut,
}: ProductImageProps) {
  const hasImage = src && src.trim().length > 0;

  return (
    <div
      className={`${aspect} w-full rounded-2xl overflow-hidden relative border border-white/[0.06] group`}
      style={{
        background: 'linear-gradient(175deg, #1E2128 0%, #151820 40%, #111520 100%)',
      }}
    >
      {hasImage ? (
        /* ── Inner image container — centered, padded, grounded ── */
        <div className="absolute inset-0 flex items-center justify-center p-6 z-10">
          {/* Ambient glow behind the image */}
          <div
            className="absolute inset-[15%] rounded-3xl pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(167,139,250,0.08) 0%, transparent 70%)',
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt={alt}
            loading="lazy"
            className="relative z-10 max-w-[78%] max-h-[78%] object-contain
              transition-transform duration-500 ease-out group-hover:scale-[1.04]
              drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]"
          />
        </div>
      ) : (
        /* ── Styled fallback placeholder ── */
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#A78BFA]/15 to-[#60A5FA]/10 border border-white/[0.06] flex items-center justify-center mb-3
            transition-transform duration-500 ease-out group-hover:scale-105">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="w-7 h-7 text-[#4B5563]"
              stroke="currentColor"
              strokeWidth={1.5}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
          <span className="text-[11px] text-[#3A3F4A] font-medium tracking-wide">
            No image
          </span>
        </div>
      )}

      {/* ── Category badge ── */}
      {category && (
        <span className="absolute top-4 left-4 z-20 text-[11px] font-medium tracking-[0.05em] uppercase text-[#9CA3AF] bg-[#0B0F1A]/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/[0.06]">
          {category}
        </span>
      )}

      {/* ── Sold Out badge ── */}
      {soldOut && (
        <span className="absolute top-4 right-4 z-20 text-[11px] font-medium tracking-[0.05em] uppercase text-[#F87171] bg-[#0B0F1A]/70 backdrop-blur-sm px-3 py-1 rounded-full border border-white/[0.06]">
          Sold Out
        </span>
      )}
    </div>
  );
}
