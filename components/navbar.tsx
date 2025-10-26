"use client";

import { PlusCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";
import { ThemeToggle } from "./theme-toggle";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo and Brand */}
        <Link
          className="flex items-center space-x-2 transition-opacity hover:opacity-80"
          href={ROUTES.HOME}
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg">
            <Image alt="Chip Logo" height={70} src="/logo.png" width={70} />
          </div>
          <span className="hidden font-bold sm:inline-block">
            Poker Chip Tracker
          </span>
        </Link>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* New Game Button */}
          <Button asChild size="sm" variant="outline">
            <Link className="flex items-center space-x-2" href={ROUTES.JOIN}>
              <PlusCircle className="h-4 w-4" />
              <span className="hidden sm:inline">Join Game</span>
            </Link>
          </Button>

          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};
