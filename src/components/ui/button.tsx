import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "group/btn inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 ease-out disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-teal [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        primary: "bg-navy text-paper hover:bg-navy-700 shadow-soft hover:shadow-lift hover:-translate-y-px",
        accent: "bg-teal text-white hover:bg-teal-600 shadow-soft hover:shadow-lift hover:-translate-y-px",
        outline: "border border-navy/15 bg-white/60 text-navy backdrop-blur hover:border-navy/40 hover:bg-white",
        ghost: "text-navy hover:bg-mist",
        light: "bg-paper text-navy hover:bg-white shadow-soft hover:-translate-y-px",
        "outline-light": "border border-white/25 text-white hover:bg-white/10 hover:border-white/50",
        link: "rounded-none px-0 text-navy underline-offset-4 hover:text-teal hover:underline",
      },
      size: {
        sm: "h-10 px-4 text-sm",
        md: "h-12 px-6 text-[0.9375rem]",
        lg: "h-14 px-8 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...(!asChild ? { type: type ?? "button" } : {})}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };
