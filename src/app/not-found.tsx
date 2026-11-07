import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="pt-44 pb-32">
      <div className="container-page max-w-xl text-center">
        <p className="eyebrow">404</p>
        <h1 className="mt-4 text-4xl font-semibold sm:text-5xl">This space is spotless — and empty.</h1>
        <p className="mt-4 text-lg text-muted">The page you’re looking for doesn’t exist.</p>
        <Button asChild className="mt-8">
          <Link href="/">Back to home</Link>
        </Button>
      </div>
    </section>
  );
}
