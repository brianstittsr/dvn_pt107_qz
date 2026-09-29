"use client";

import { cn } from "@/lib/utils";

export function Propeller({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="8" className="fill-tan" />
      <g className="origin-center propeller-spin">
        <path
          d="M50 42 C30 20, 20 30, 42 50 L50 42 Z"
          className="fill-current opacity-80"
        />
        <path
          d="M58 50 C80 30, 70 20, 50 42 L58 50 Z"
          className="fill-current opacity-80"
        />
        <path
          d="M50 58 C70 80, 80 70, 58 50 L50 58 Z"
          className="fill-current opacity-80"
        />
        <path
          d="M42 50 C20 70, 30 80, 50 58 L42 50 Z"
          className="fill-current opacity-80"
        />
      </g>
    </svg>
  );
}

export function CameraLens({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-8 w-8", className)}
      aria-hidden="true"
    >
      <rect x="15" y="30" width="70" height="45" rx="8" className="fill-olive-dark stroke-tan" strokeWidth="2" />
      <circle cx="50" cy="52.5" r="16" className="stroke-tan" strokeWidth="3" />
      <circle cx="50" cy="52.5" r="10" className="fill-navy stroke-tan" strokeWidth="2" />
      <circle cx="54" cy="48.5" r="3" className="fill-tan-light/60" />
    </svg>
  );
}

export function DroneBadge({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-tan/40 bg-olive-dark/20 text-olive-light">
        <Propeller className="absolute h-8 w-8 opacity-30" />
        <CameraLens className="relative z-10 h-5 w-5" />
      </div>
    </div>
  );
}
