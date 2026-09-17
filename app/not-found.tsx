import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/primitives/Container";
import { MagneticButton } from "@/components/primitives/MagneticButton";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <>
      <Header />
      <main id="main">
        <Container className="flex min-h-[70svh] flex-col justify-center py-32">
          <span className="eyebrow block">404</span>
          <h1 className="mt-5 max-w-2xl text-h1">This page doesn&apos;t exist.</h1>
          <p className="mt-6 max-w-md text-lead leading-relaxed text-muted">
            The page you&apos;re looking for isn&apos;t here — it may have
            moved, or the link may be out of date.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <MagneticButton href="/">Back to home</MagneticButton>
            <MagneticButton href="/#work" variant="outline">
              View our work
            </MagneticButton>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
