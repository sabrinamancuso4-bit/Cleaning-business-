import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/legal-page";

export const metadata: Metadata = { title: "Privacy notice" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy notice">
      <h2>What this demo does with your data</h2>
      <p>
        Nothing leaves your browser. Forms on this website validate your input locally and display a confirmation, but
        no information is transmitted to a server, stored in a database, saved in cookies or shared with third parties.
      </p>
      <h2>Analytics and cookies</h2>
      <p>This demonstration does not use analytics, tracking pixels or advertising cookies.</p>
      <h2>For a live version</h2>
      <p>
        A live website would need a full UK GDPR-compliant privacy notice covering the data controller, lawful basis,
        retention periods, data subject rights and how to contact the Information Commissioner’s Office.
      </p>
    </LegalPage>
  );
}
