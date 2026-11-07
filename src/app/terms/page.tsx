import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = { title: "Terms of use" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms of use">
      <h2>Demonstration only</h2>
      <p>
        This website demonstrates a proposed commercial cleaning business. The business name is a placeholder, and no
        services are currently offered, sold or contracted through this site.
      </p>
      <h2>Estimates</h2>
      <p>
        Figures produced by the quote estimator are illustrative, based on example assumptions. They are not offers,
        market quotations or binding prices.
      </p>
      <h2>Images</h2>
      <p>Images are illustrative placeholders and do not show real premises, staff or clients.</p>
    </LegalPage>
  );
}
