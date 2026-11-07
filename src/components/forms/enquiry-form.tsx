"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { CheckCircle2, Loader2, Send, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form-fields";
import { propertyTypes } from "@/config/pricing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

const phonePattern = /^\+?[0-9 ()-]{10,20}$/;

export const enquirySchema = z
  .object({
    fullName: z.string().trim().min(2, "Please enter your full name"),
    businessName: z.string().trim().min(2, "Please enter your business name"),
    email: z.string().trim().min(1, "Please enter your business email").pipe(z.email("Please enter a valid email address")),
    phone: z
      .string()
      .trim()
      .refine((v) => v === "" || (phonePattern.test(v) && v.replace(/\D/g, "").length >= 10), "Please enter a valid UK phone number"),
    premisesType: z.string().min(1, "Please choose a type of premises"),
    location: z.string().trim().min(2, "Please enter a location or postcode").max(60, "Please keep this under 60 characters"),
    message: z.string().trim().max(2000, "Please keep your message under 2,000 characters"),
    contactMethod: z.enum(["email", "phone", "either"], { message: "Please choose a contact method" }),
  })
  .refine((d) => d.contactMethod === "email" || d.phone !== "", {
    path: ["phone"],
    message: "Please add a phone number so we can call you",
  });

export type EnquiryValues = z.infer<typeof enquirySchema>;

const contactMethods = [
  { value: "email", label: "Email" },
  { value: "phone", label: "Phone" },
  { value: "either", label: "Either" },
] as const;

export function EnquiryForm({
  defaultValues,
  context,
  onReset,
  compact = false,
}: {
  defaultValues?: Partial<EnquiryValues>;
  /** Read-only summary shown above the form (e.g. quote selections). */
  context?: React.ReactNode;
  onReset?: () => void;
  compact?: boolean;
}) {
  const reduce = useReducedMotion();
  const [submitted, setSubmitted] = React.useState<EnquiryValues | null>(null);
  const successRef = React.useRef<HTMLDivElement>(null);
  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<EnquiryValues>({
    resolver: zodResolver(enquirySchema),
    mode: "onTouched",
    defaultValues: {
      fullName: "",
      businessName: "",
      email: "",
      phone: "",
      premisesType: "",
      location: "",
      message: "",
      contactMethod: "email",
      ...defaultValues,
    },
  });

  React.useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const onSubmit = async (values: EnquiryValues) => {
    // DEMO ONLY: nothing is transmitted or stored. We simulate a short delay
    // so the loading state can be seen, then show a confirmation.
    await new Promise((r) => setTimeout(r, 900));
    setSubmitted(values);
  };

  const describedBy = (name: keyof EnquiryValues) => (errors[name] ? `${name}-error` : undefined);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {submitted ? (
        <motion.div
          key="success"
          ref={successRef}
          tabIndex={-1}
          initial={reduce ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="rounded-[var(--radius-card)] border border-teal/20 bg-teal-100/50 p-6 outline-none sm:p-8"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2 className="size-10 text-teal" aria-hidden />
          <h3 className="mt-4 text-2xl font-semibold">Thank you, {submitted.fullName.split(" ")[0]}.</h3>
          <p className="mt-3 leading-relaxed text-charcoal">
            In a live version, a member of the team would contact you by{" "}
            {submitted.contactMethod === "either" ? "email or phone" : submitted.contactMethod} to arrange a premises
            assessment for <strong className="font-semibold">{submitted.businessName}</strong>.
          </p>
          <p className="mt-4 flex items-start gap-2 rounded-xl bg-white/70 p-4 text-sm text-muted">
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
            <span>
              <strong className="font-semibold text-navy">Demo only:</strong> your enquiry has not been sent or stored
              anywhere. {siteConfig.demoNotice.split(".")[0]}.
            </span>
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setSubmitted(null);
                reset();
                onReset?.();
                setTimeout(() => setFocus("fullName"), 50);
              }}
            >
              Start a new enquiry
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          aria-describedby="demo-form-note"
          className="flex flex-col gap-5"
        >
          {context}
          <div className={cn("grid gap-5", !compact && "sm:grid-cols-2")}>
            <Field id="fullName" label="Full name" required error={errors.fullName?.message}>
              <Input id="fullName" autoComplete="name" aria-invalid={!!errors.fullName} aria-describedby={describedBy("fullName")} {...register("fullName")} />
            </Field>
            <Field id="businessName" label="Business name" required error={errors.businessName?.message}>
              <Input id="businessName" autoComplete="organization" aria-invalid={!!errors.businessName} aria-describedby={describedBy("businessName")} {...register("businessName")} />
            </Field>
            <Field id="email" label="Business email" required error={errors.email?.message}>
              <Input id="email" type="email" inputMode="email" autoComplete="email" placeholder="name@business.co.uk" aria-invalid={!!errors.email} aria-describedby={describedBy("email")} {...register("email")} />
            </Field>
            <Field id="phone" label="Phone number" error={errors.phone?.message} hint="Required if you’d like a call back">
              <Input id="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="0161 000 0000" aria-invalid={!!errors.phone} aria-describedby={describedBy("phone") ?? "phone-hint"} {...register("phone")} />
            </Field>
            <Field id="premisesType" label="Type of premises" required error={errors.premisesType?.message}>
              <Select id="premisesType" aria-invalid={!!errors.premisesType} aria-describedby={describedBy("premisesType")} {...register("premisesType")}>
                <option value="" disabled>
                  Select premises type
                </option>
                {propertyTypes.map((t) => (
                  <option key={t.id} value={t.label}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field id="location" label="Location or postcode" required error={errors.location?.message}>
              <Input id="location" autoComplete="postal-code" placeholder="e.g. M1 or Salford Quays" aria-invalid={!!errors.location} aria-describedby={describedBy("location")} {...register("location")} />
            </Field>
          </div>

          <Field id="message" label="Message" error={errors.message?.message}>
            <Textarea id="message" rows={compact ? 5 : 5} placeholder="Tell us about your premises, preferred cleaning times or anything else we should know." aria-invalid={!!errors.message} aria-describedby={describedBy("message")} {...register("message")} />
          </Field>

          <fieldset>
            <legend className="mb-2 text-sm font-medium text-navy">
              Preferred contact method<span className="text-teal"> *</span>
            </legend>
            <div className="grid grid-cols-3 gap-2">
              {contactMethods.map((m) => (
                <label key={m.value} className="relative">
                  <input type="radio" value={m.value} className="peer sr-only" {...register("contactMethod")} />
                  <span className="flex h-12 cursor-pointer items-center justify-center rounded-xl border border-line bg-white text-sm font-medium text-charcoal transition-all hover:border-navy/30 peer-checked:border-navy peer-checked:bg-navy peer-checked:text-paper peer-focus-visible:ring-4 peer-focus-visible:ring-teal/30">
                    {m.label}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {Object.keys(errors).length > 1 && (
            <p role="alert" className="rounded-xl bg-danger/5 px-4 py-3 text-sm text-danger">
              Please check the {Object.keys(errors).length} highlighted fields above.
            </p>
          )}

          <div className="flex flex-col gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <p id="demo-form-note" className="flex items-start gap-2 text-xs leading-relaxed text-muted sm:max-w-xs">
              <ShieldCheck className="mt-0.5 size-4 shrink-0 text-teal" aria-hidden />
              Demo form: details are validated in your browser only and are never sent or stored.
            </p>
            <Button type="submit" variant="accent" size="lg" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="animate-spin" aria-hidden /> Submitting…
                </>
              ) : (
                <>
                  Send enquiry <Send aria-hidden />
                </>
              )}
            </Button>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
