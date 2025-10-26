"use client";

import { Github } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EXTERNAL_ROUTES, ROUTES } from "@/lib/routes";

export const Footer = () => {
  const router = useRouter();

  return (
    <footer className="bg-muted/60">
      <div className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col items-center justify-between gap-4">
          <div className="space-y-2">
            <p className="font-medium text-sm">
              2025 Chip • All Rights Reserved
            </p>
            <p className="text-muted-foreground text-xs">
              Designed with precision and clarity
            </p>
          </div>

          <nav className="flex flex-col items-center gap-6">
            <div className="flex items-center gap-6">
              <button
                className="text-muted-foreground text-sm transition-colors hover:cursor-pointer hover:text-foreground hover:underline"
                onClick={() => router.push(ROUTES.TERMS)}
                type="button"
              >
                Terms & Conditions
              </button>
              <button
                className="text-muted-foreground text-sm transition-colors hover:cursor-pointer hover:text-foreground hover:underline"
                onClick={() => router.push(ROUTES.PRIVACY)}
                type="button"
              >
                Privacy Policy
              </button>
            </div>
            <Link
              aria-label="GitHub repository"
              className="text-muted-foreground transition-colors hover:text-foreground"
              href={EXTERNAL_ROUTES.GITHUB}
              rel="noopener noreferrer"
              target="_blank"
            >
              <Github className="size-5" />
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};
