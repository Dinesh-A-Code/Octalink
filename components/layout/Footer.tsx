import { navLinks, site, socialLinks } from "@/content/site";
import { services } from "@/content/services";
import { AnimatedLink } from "@/components/primitives/AnimatedLink";
import { Container } from "@/components/primitives/Container";
import { SectionMotion } from "@/components/primitives/SectionMotion";
import { ThemeToggle } from "./ThemeToggle";

export function Footer() {
  return (
    <footer className="hairline-t">
      <SectionMotion>
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-[1.4fr_repeat(3,1fr)] md:gap-8 md:py-20">
          <div>
            <p className="font-display text-[1.0625rem] font-semibold uppercase tracking-[0.22em]">
              {site.name}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted">
              An independent digital studio building websites and software for
              businesses that need both to work.
            </p>
          </div>

          <FooterColumn title="Services">
            {services.map((s) => (
              <li key={s.id}>
                <AnimatedLink href="/#services" className="text-sm text-muted">
                  {s.title}
                </AnimatedLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Studio">
            {navLinks.map((l) => (
              <li key={l.href}>
                <AnimatedLink href={l.href} className="text-sm text-muted">
                  {l.label}
                </AnimatedLink>
              </li>
            ))}
          </FooterColumn>

          <FooterColumn title="Elsewhere">
            {socialLinks.map((l) =>
              l.href ? (
                <li key={l.label}>
                  <AnimatedLink
                    href={l.href}
                    external
                    className="text-sm text-muted"
                  >
                    {l.label}
                  </AnimatedLink>
                </li>
              ) : (
                <li key={l.label} className="text-sm text-faint">
                  {l.label}
                </li>
              ),
            )}
          </FooterColumn>
        </div>

        <div className="flex flex-col items-start justify-between gap-6 border-t border-line py-8 sm:flex-row sm:items-center">
          <p className="font-mono text-xs uppercase tracking-[0.14em] text-faint">
            © {new Date().getFullYear()} {site.name} — {site.operators.join(" & ")}
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-faint">
              Theme
            </span>
            <ThemeToggle />
          </div>
        </div>
      </Container>
      </SectionMotion>
    </footer>
  );
}

function FooterColumn({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="eyebrow font-mono">{title}</h3>
      <ul className="mt-5 flex flex-col gap-3">{children}</ul>
    </div>
  );
}
