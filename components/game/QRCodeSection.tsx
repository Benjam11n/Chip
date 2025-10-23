'use client';

import { QrCode, Copy } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface QRCodeSectionProps {
  qrCode: string;
  onCopyLink: () => Promise<void>;
}

export function QRCodeSection({ qrCode, onCopyLink }: QRCodeSectionProps) {
  return (
    <div className="space-y-4">
      {qrCode ? (
        <div className="flex justify-center">
          <Image width={256} height={256} src={qrCode} alt="Join QR Code" className="rounded-md" />
        </div>
      ) : (
        <div className="flex justify-center">
          <Skeleton className="size-64" />
        </div>
      )}

      <div className="flex gap-2">
        <Button variant="outline" className="flex-1" onClick={onCopyLink}>
          <Copy className="mr-2 size-4" />
          Copy Link
        </Button>
        <Button variant="outline" className="flex-1" onClick={() => window.print()}>
          <QrCode className="mr-2 size-4" />
          Save QR
        </Button>
      </div>
    </div>
  );
}
