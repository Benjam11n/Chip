"use client";

import { Home } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/routes";

const NotFoundPage = () => (
  <div className="flex min-h-[calc(100vh-10rem)] flex-col items-center justify-center text-center">
    <div className="space-y-4">
      <h1 className="font-bold text-9xl">404</h1>
      <p className="font-medium text-2xl">Page Not Found</p>
      <p className="text-muted-foreground">
        The page you are looking for does not exist or has been moved.
      </p>
    </div>
    <Button asChild className="mt-8">
      <Link href={ROUTES.HOME}>
        <Home className="mr-2 size-4" />
        Go to Homepage
      </Link>
    </Button>
  </div>
);

export default NotFoundPage;
