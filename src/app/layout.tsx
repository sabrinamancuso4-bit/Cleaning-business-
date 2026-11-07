import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/manrope";
import "./globals.css";
import { siteConfig } from "@/config/site";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileQuoteBar } from "@/components/layout/mobile-quote-bar";
import { QuoteProvider } from "@/components/quote/quote-context";
import { MotionProvider } from "@/components/ui/motion-provider";

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} | ${siteConfig.city} (Demo)`,
    template: `%s | ${siteConfig.name} (Demo)`,
  },
  description: siteConfig.description,
  // Demonstration site: keep it out of search engines.
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#142638",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-GB" className="h-full">
      <body className="flex min-h-full flex-col overflow-x-clip">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy focus:px-5 focus:py-3 focus:text-paper"
        >
          Skip to content
        </a>
        <MotionProvider>
          <QuoteProvider>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
            <MobileQuoteBar />
          </QuoteProvider>
        </MotionProvider>
      </body>
    </html>
  );
}
