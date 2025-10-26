import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

export default function TermsPage() {
  return (
    <div className="min-h-screen">
      <div className="container mx-auto max-w-4xl px-4 py-8">
        <Link href={ROUTES.HOME}>
          <Button className="mb-6" variant="ghost">
            <ArrowLeft className="mr-2 size-4" />
            Back to Home
          </Button>
        </Link>

        <Card className="p-8">
          <h1 className="mb-6 font-bold text-3xl">Terms & Conditions</h1>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing and using Chip, you accept and agree to be bound by
                the terms and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily use Chip for the purpose of
                playing poker games with friends and family. This is the grant
                of a license, not a transfer of title, and under this license
                you may not:
              </p>
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>use the materials for any commercial purpose</li>
                <li>
                  attempt to reverse engineer any software contained on Chip
                </li>
                <li>
                  remove any copyright or other proprietary notations from the
                  materials
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                3. Disclaimer
              </h2>
              <p>
                The materials on Chip are provided on an 'as is' basis. Chip
                makes no warranties, expressed or implied, and hereby disclaims
                and negates all other warranties including without limitation,
                implied warranties or conditions of merchantability, fitness for
                a particular purpose, or non-infringement of intellectual
                property or other violation of rights.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                4. Privacy
              </h2>
              <p>
                Your privacy is important to us. Please review our Privacy
                Policy, which also governs the Site and informs users of our
                data collection practices.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                5. Limitations
              </h2>
              <p>
                In no event shall Chip or its suppliers be liable for any
                damages (including, without limitation, damages for loss of data
                or profit, or due to business interruption) arising out of the
                use or inability to use Chip, even if Chip or an authorized
                representative has been notified orally or in writing of the
                possibility of such damage.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                6. Governing Law
              </h2>
              <p>
                These terms and conditions are governed by and construed in
                accordance with the laws and you irrevocably submit to the
                exclusive jurisdiction of the courts in that state or location.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
