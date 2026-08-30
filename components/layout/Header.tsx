"use client";

import { useEffect, useRef, useState } from "react";
import { navLinks, site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils/cn";

export function Header() {
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  // Single boolean flip, not a per-scroll state stream.
  useEffect(() => {
    const el = document.createElement("div");
    el.style.cssText = "position:absolute;top:0;height:1px;width:1px;";
    document.body.appendChild(el);
    const observer = new IntersectionObserver(
      ([entry]) => setCondensed(!entry.isIntersecting),
      { rootMargin: "-80px 0px 0px 0px" },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      el.remove();
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <header
      ref={headerRef}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,padding] duration-500 ease-out-expo",
        condensed
          ? "border-b border-line bg-bg py-3"
          : "border-b border-transparent py-6",
      )}
    >
      <div className="container-x flex items-center justify-between gap-6">
        <a
          href="#top"
          className="font-display text-[1.0625rem] font-semibold uppercase tracking-[0.22em]"
        >
          {site.name}
        </a>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-9">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative text-[0.8125rem] uppercase tracking-[0.12em] text-muted transition-colors duration-300 hover:text-fg"
                >
                  {link.label}
                  <span
                    aria-hidden="true"
                    className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-accent transition-transform duration-[400ms] ease-out-expo group-hover:scale-x-100 group-focus-visible:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href="#contact"
            className="hidden rounded-sharp border border-line-strong px-5 py-2.5 text-[0.75rem] font-medium uppercase tracking-[0.14em] transition-colors duration-300 hover:border-accent hover:text-accent sm:inline-block"
          >
            Start a project
          </a>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="grid h-10 w-10 place-items-center rounded-sharp border border-line md:hidden"
          >
            <span className="relative block h-3 w-4">
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-fg transition-all duration-300 ease-out-expo",
                  open ? "top-1.5 rotate-45" : "top-0",
                )}
              />
              <span
                className={cn(
                  "absolute left-0 block h-px w-full bg-fg transition-all duration-300 ease-out-expo",
                  open ? "top-1.5 -rotate-45" : "top-3",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-line bg-bg md:hidden"
      >
        <nav aria-label="Mobile" className="container-x py-8">
          <ul className="flex flex-col gap-1">
            {[...navLinks, { label: "Contact", href: "#contact" }].map(
              (link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block border-b border-line py-4 font-display text-2xl"
                  >
                    {link.label}
                  </a>
                </li>
              ),
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}
