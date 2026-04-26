import Link from "next/link";
import { LogoPlantSVG } from "@/components/icons/botanical";

const SHOP_LINKS = [
  { label: "All herbs",   href: "/medicines" },
  { label: "Adaptogens",  href: "/categories/adaptogens" },
  { label: "Skin & Beauty", href: "/categories/skin-care" },
  { label: "Digestive",   href: "/categories/digestive" },
  { label: "Featured",    href: "/medicines?featured=true" },
];

const ACCOUNT_LINKS = [
  { label: "Sign in",   href: "/login" },
  { label: "Register",  href: "/register" },
  { label: "My orders", href: "/orders" },
  { label: "Basket",    href: "/cart" },
];

const COMPANY_LINKS = [
  { label: "Our story",      href: "/about" },
  { label: "Our herbalists", href: "/about#herbalists" },
];

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4
        style={{
          fontFamily: "var(--font-jetbrains-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "var(--clay)",
          marginBottom: 20,
          fontWeight: 500,
        }}
      >
        {title}
      </h4>
      <ul className="flex flex-col gap-2.5">
        {links.map(({ label, href }) => (
          <li key={label}>
            <Link
              href={href}
              style={{
                fontFamily: "var(--font-cormorant), Georgia, serif",
                fontStyle: "italic",
                fontSize: 17,
                color: "var(--ink)",
              }}
              className="transition-colors hover:text-[var(--moss)]"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const Footer = () => {
  return (
    <footer
      style={{
        background: "var(--parchment)",
        padding: "clamp(48px, 6vw, 90px) 0 36px",
        position: "relative",
        zIndex: 2,
        borderTop: "1px solid var(--rule)",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-10">

        {/* ── Top grid ──────────────────────────────────── */}
        <div
          className="grid gap-8 md:gap-10 mb-12 md:mb-16 grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]"
        >
          {/* Brand column — full width on mobile */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <LogoPlantSVG
                width={40}
                height={40}
                style={{ color: "var(--moss)" }}
              />
              <div>
                <div
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontWeight: 500,
                    fontSize: 28,
                    color: "var(--ink)",
                    lineHeight: 1,
                  }}
                >
                  GreenRoots
                  <span style={{ color: "var(--clay)", marginLeft: 1 }}>☘</span>
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 9,
                    letterSpacing: "0.1em",
                    color: "var(--bark)",
                    marginTop: 4,
                  }}
                >
                  apothecary · est. ✦ 2024
                </div>
              </div>
            </Link>

            <p
              className="mt-5 text-sm leading-relaxed"
              style={{ maxWidth: 320, color: "var(--bark-2)" }}
            >
              A modern herbal apothecary rooted in old traditions. Herbs, roots
              and organic remedies — sourced with care, delivered in hours.
            </p>

            {/* Socials */}
            <div className="flex gap-3 mt-5">
              {[
                { label: "Facebook",  href: "#", icon: "f"  },
                { label: "Instagram", href: "#", icon: "ig" },
                { label: "X",         href: "#", icon: "x"  },
              ].map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    border: "1px solid var(--rule)",
                    color: "var(--bark)",
                    fontFamily: "var(--font-jetbrains-mono), monospace",
                    fontSize: 9,
                    letterSpacing: "0.05em",
                  }}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          <FooterCol title="Shop"    links={SHOP_LINKS}    />
          <FooterCol title="Account" links={ACCOUNT_LINKS} />
          <FooterCol title="Company" links={COMPANY_LINKS} />

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h4
              style={{
                fontFamily: "var(--font-jetbrains-mono), monospace",
                fontSize: 10,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--clay)",
                marginBottom: 20,
                fontWeight: 500,
              }}
            >
              Visit
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                "hello@greenroots.com.bd",
                "+880 1234-567890",
                "27 Road 4, Dhanmondi",
                "Dhaka, Bangladesh",
              ].map((item) => (
                <li
                  key={item}
                  style={{
                    fontFamily: "var(--font-cormorant), Georgia, serif",
                    fontStyle: "italic",
                    fontSize: 16,
                    color: "var(--bark-2)",
                  }}
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Mega wordmark ──────────────────────────────── */}
        <div
          className="relative overflow-hidden"
          style={{
            fontFamily: "var(--font-cormorant), Georgia, serif",
            fontWeight: 500,
            fontSize: "clamp(48px, 15vw, 220px)",
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            color: "var(--ink)",
            margin: "32px 0 24px",
            whiteSpace: "nowrap",
          }}
        >
          <div
            className="absolute pointer-events-none"
            style={{
              top: "50%",
              left: 0,
              width: "100%",
              height: 1,
              background: "var(--moss-soft)",
              opacity: 0.4,
              zIndex: -1,
            }}
          />
          <span>Green</span>
          <em style={{ color: "var(--moss)", fontStyle: "italic" }}>Roots</em>
          <span
            style={{
              fontSize: "0.5em",
              verticalAlign: "super",
              color: "var(--clay)",
            }}
          >
            ☘
          </span>
        </div>

        {/* ── Bottom bar ─────────────────────────────────── */}
        <div
          className="flex flex-col sm:flex-row flex-wrap justify-between items-start sm:items-center gap-4 sm:gap-5 pt-6"
          style={{
            borderTop: "1px solid var(--rule)",
            fontFamily: "var(--font-jetbrains-mono), monospace",
            fontSize: 10,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "var(--bark)",
          }}
        >
          <span>
            © {new Date().getFullYear()} · GreenRoots☘ Apothecary · All rights reserved
          </span>
          <div className="flex flex-wrap gap-4 sm:gap-6">
            {["Privacy", "Terms"].map((item) => (
              <span
                key={item}
                style={{ color: "inherit" }}
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
