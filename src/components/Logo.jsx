"use client";

import Link from "next/link";

export default function Logo({ size = "default", showText = true }) {
  const sizes = {
    small: { icon: "w-6 h-6", text: "text-base" },
    default: { icon: "w-8 h-8", text: "text-lg" },
    large: { icon: "w-12 h-12", text: "text-2xl" },
  };

  const { icon, text } = sizes[size] || sizes.default;

  return (
    <Link href="/" className="flex items-center gap-2">
      <div className={`${icon} relative`}>
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Code brackets */}
          <rect
            x="2"
            y="2"
            width="36"
            height="36"
            rx="8"
            className="fill-pink-700"
          />
          {/* Left bracket */}
          <path
            d="M14 12L8 20L14 28"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Right bracket */}
          <path
            d="M26 12L32 20L26 28"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Center dot/node */}
          <circle cx="20" cy="20" r="3" fill="white" />
        </svg>
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${text} font-bold tracking-tight leading-none`}>
            LeetCode
          </span>
          <span className="text-xs text-muted-foreground tracking-wide">
            ACADEMY
          </span>
        </div>
      )}
    </Link>
  );
}
