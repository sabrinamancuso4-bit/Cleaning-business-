import { cn } from "@/lib/utils";
import { Reveal } from "./reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  className,
  as: Tag = "h2",
  tone = "dark",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
  tone?: "dark" | "light";
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className={cn("eyebrow mb-4", tone === "light" && "text-teal-100")}>{eyebrow}</p>}
      <Tag
        className={cn(
          "font-display font-semibold leading-[1.08]",
          Tag === "h1" ? "text-4xl sm:text-5xl lg:text-6xl" : "text-3xl sm:text-4xl lg:text-[2.75rem]",
          tone === "light" && "text-paper",
        )}
      >
        {title}
      </Tag>
      {intro && (
        <p className={cn("mt-5 text-lg leading-relaxed", tone === "light" ? "text-paper/75" : "text-muted")}>{intro}</p>
      )}
    </Reveal>
  );
}
