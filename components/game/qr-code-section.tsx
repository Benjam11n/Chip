"use client";

import { Copy, QrCode } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

type QRCodeSectionProps = {
  qrCode: string;
  onCopyLink: () => Promise<void>;
};

export function QRCodeSection({ qrCode, onCopyLink }: QRCodeSectionProps) {
  return (
    <div className="space-y-4">
      {qrCode ? (
        <div className="flex justify-center">
          <Image
            alt="Join QR Code"
            className="rounded-md"
            height={256}
            src={qrCode}
            width={256}
          />
        </div>
      ) : (
        <div className="flex justify-center">
          <Skeleton className="size-64" />
        </div>
      )}

      <div className="flex gap-2">
        <Button className="flex-1" onClick={onCopyLink} variant="outline">
          <Copy className="mr-2 size-4" />
          Copy Link
        </Button>
        <Button
          className="flex-1"
          onClick={() => window.print()}
          variant="outline"
        >
          <QrCode className="mr-2 size-4" />
          Save QR
        </Button>
      </div>
    </div>
  );
}
