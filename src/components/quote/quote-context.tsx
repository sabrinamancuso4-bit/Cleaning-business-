"use client";

import * as React from "react";
import type { FrequencyId, PropertyTypeId, SizeId } from "@/config/pricing";
import { QuoteDialog } from "./quote-dialog";

export type QuotePreset = { propertyType?: PropertyTypeId; size?: SizeId; frequency?: FrequencyId };
type OpenOptions = QuotePreset;

type QuoteContextValue = {
  open: boolean;
  openQuote: (options?: OpenOptions) => void;
  setOpen: (open: boolean) => void;
};

const QuoteContext = React.createContext<QuoteContextValue | null>(null);

export function QuoteProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const [preset, setPreset] = React.useState<OpenOptions>({});
  const [session, setSession] = React.useState(0);

  const openQuote = React.useCallback((options: OpenOptions = {}) => {
    setPreset(options);
    // A preset from a specific service starts a fresh estimate.
    if (options.propertyType || options.size || options.frequency) setSession((s) => s + 1);
    setOpen(true);
  }, []);

  const value = React.useMemo(() => ({ open, openQuote, setOpen }), [open, openQuote]);

  return (
    <QuoteContext.Provider value={value}>
      {children}
      <QuoteDialog key={session} open={open} onOpenChange={setOpen} preset={preset} />
    </QuoteContext.Provider>
  );
}

export function useQuote() {
  const ctx = React.useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside <QuoteProvider>");
  return ctx;
}
