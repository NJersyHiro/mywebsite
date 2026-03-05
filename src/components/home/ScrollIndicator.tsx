"use client";

export default function ScrollIndicator() {
  return (
    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2">
      <div className="w-6 h-10 border-2 border-text-sub/30 rounded-full flex items-start justify-center pt-2">
        <div className="w-1 h-2 bg-neon-blue rounded-full animate-pulse" />
      </div>
      <div className="animate-bounce">
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className="text-text-sub/30"
        >
          <path
            d="M8 12L2 6h12L8 12z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
