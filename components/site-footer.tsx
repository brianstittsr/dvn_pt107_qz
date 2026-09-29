import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { DroneBadge } from "@/components/drone-art";
import { ChevronRank } from "@/components/military";

const trainLinks = [
  { href: "/quiz", label: "Quiz Lab" },
  { href: "/vocab", label: "Vocabulary" },
  { href: "/progress", label: "Progress" },
  { href: "/dashboard", label: "Dashboard" },
];

const accountLinks = [
  { href: "/login", label: "Sign in" },
  { href: "/activate", label: "Go Pro — $97/mo" },
  { href: "/admin", label: "Command Center" },
];

const resourceLinks = [
  { href: "https://www.faa.gov/uas/commercial_operators", label: "FAA Part 107 Overview" },
  { href: "https://www.faa.gov/training_testing/testing/test_guides", label: "FAA Knowledge Test Guide" },
  { href: "https://www.faa.gov/uas/getting_started/b4ufly", label: "B4UFLY / Airspace" },
];

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden bg-navy text-tan-light/80">
      <div className="hazard-stripe absolute inset-x-0 top-0" aria-hidden="true" />
      <div className="pointer-events-none absolute inset-0 camo-pattern" aria-hidden="true" />
      <div className="relative mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-3">
              <DroneBadge />
              <span className="stencil text-sm text-white">Part 107 Flight School</span>
            </Link>
            <p className="text-sm text-tan-light/70">
              Mission-focused prep for the FAA Remote Pilot (Part 107) knowledge test.
            </p>
            <ChevronRank readiness={100} dark />
          </div>

          <div>
            <h3 className="stencil text-xs text-olive-light">Train</h3>
            <ul className="mt-4 space-y-2">
              {trainLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-tan-light/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="stencil text-xs text-olive-light">Account</h3>
            <ul className="mt-4 space-y-2">
              {accountLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-tan-light/70 hover:text-white">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="stencil text-xs text-olive-light">Resources</h3>
            <ul className="mt-4 space-y-2">
              {resourceLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-sm text-tan-light/70 hover:text-white"
                  >
                    {link.label}
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-2 border-t border-tan-light/20 pt-6 text-xs text-tan-light/60 sm:flex-row">
          <p>© {new Date().getFullYear()} Part 107 Flight School. All rights reserved.</p>
          <p>
            Not affiliated with or endorsed by the FAA. Study aid only — not a substitute for
            official FAA materials.
          </p>
        </div>
      </div>
    </footer>
  );
}
