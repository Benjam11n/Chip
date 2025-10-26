import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/lib/routes";

export default function PrivacyPage() {
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
          <h1 className="mb-6 font-bold text-3xl">Privacy Policy</h1>

          <div className="space-y-6 text-muted-foreground">
            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                1. Information We Collect
              </h2>
              <p>
                We may collect information about you in a variety of ways. The
                information we may collect on the Site includes:
              </p>
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>Game data and statistics</li>
                <li>Temporary game room information</li>
                <li>Browser and device information</li>
                <li>Usage data and analytics</li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                2. How We Use Your Information
              </h2>
              <p>
                We use the information we collect in various ways, including to:
              </p>
              <ul className="mt-2 ml-6 list-disc space-y-1">
                <li>Provide, operate, and maintain our service</li>
                <li>Improve, personalize, and develop our service</li>
                <li>Understand and analyze how you use our service</li>
                <li>
                  Develop new products, services, features, and functionality
                </li>
              </ul>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                3. Data Storage
              </h2>
              <p>
                Game sessions and temporary data are stored only during active
                gameplay. We do not store personal information or financial
                data. All game data is deleted after the session ends.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                4. Cookies
              </h2>
              <p>
                We use cookies and similar tracking technologies to track
                activity on our service and hold certain information. You can
                instruct your browser to refuse all cookies or to indicate when
                a cookie is being sent.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                5. Security
              </h2>
              <p>
                The security of your data is important to us, but remember that
                no method of transmission over the Internet or method of
                electronic storage is 100% secure.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                6. Children's Privacy
              </h2>
              <p>
                Our service does not address anyone under the age of 13. We do
                not knowingly collect personally identifiable information from
                anyone under the age of 13.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                7. Changes to This Privacy Policy
              </h2>
              <p>
                We may update our Privacy Policy from time to time. We will
                notify you of any changes by posting the new Privacy Policy on
                this page and updating the "Last updated" date.
              </p>
            </section>

            <section>
              <h2 className="mb-2 font-semibold text-foreground text-lg">
                8. Contact Us
              </h2>
              <p>
                If you have any questions about this Privacy Policy, please
                contact us through our GitHub repository.
              </p>
            </section>
          </div>
        </Card>
      </div>
    </div>
  );
}
