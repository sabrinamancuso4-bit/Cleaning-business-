"use client";

import { ArrowRight } from "lucide-react";
import { Button, type ButtonProps } from "@/components/ui/button";
import type { PropertyTypeId } from "@/config/pricing";
import type { QuotePreset } from "./quote-context";
import { useQuote } from "./quote-context";

/** Any "Get a Quote" button. Opens the estimator, optionally preselecting a premises type. */
export function QuoteButton({
  propertyType,
  preset,
  children = "Get a Quote",
  arrow = true,
  onClick,
  ...props
}: ButtonProps & { propertyType?: PropertyTypeId; preset?: QuotePreset; arrow?: boolean }) {
  const { openQuote } = useQuote();
  return (
    <Button
      aria-haspopup="dialog"
      onClick={(e) => {
        onClick?.(e);
        openQuote(preset ?? { propertyType });
      }}
      {...props}
    >
      {children}
      {arrow && <ArrowRight className="transition-transform duration-300 group-hover/btn:translate-x-0.5" aria-hidden />}
    </Button>
  );
}
