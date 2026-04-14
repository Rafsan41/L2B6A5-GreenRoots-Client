import Link from "next/link";
import { Pill, Mail, Phone, MapPin } from "lucide-react";

const quickLinks = [
  { title: "Home", url: "/" },
  { title: "Shop", url: "/medicines" },
  { title: "Categories", url: "/categories" },
  { title: "About", url: "/about" },
  { title: "Contact", url: "/contact" },
];

const accountLinks = [
  { title: "Login", url: "/login" },
  { title: "Register", url: "/register" },
  { title: "My Orders", url: "/dashboard/orders" },
  { title: "Cart", url: "/cart" },
];

const socials = [
  {
    src: "https://img.icons8.com/color/48/facebook-new.png",
    url: "https://facebook.com",
    label: "Facebook",
  },
  {
    src: "https://img.icons8.com/color/48/twitterx--v1.png",
    url: "https://twitter.com",
    label: "Twitter",
  },
  {
    src: "https://img.icons8.com/color/48/instagram-new--v1.png",
    url: "https://instagram.com",
    label: "Instagram",
  },
  {
    src: "https://img.icons8.com/color/48/linkedin.png",
    url: "https://linkedin.com",
    label: "LinkedIn",
  },
];

const Footer = () => {
  return (
    <footer className="mt-8 border-t bg-muted/30">
      <div className="container mx-auto px-4 py-14">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <Pill className="size-7 text-primary" />
              <span className="text-2xl font-bold tracking-tight">
                MediStore
              </span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              Your trusted online pharmacy. Genuine medicines delivered to your
              doorstep with fast, reliable service.
            </p>
            <div className="flex gap-3">
              {socials.map(({ src, url, label }) => (
                <Link
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex size-10 items-center justify-center rounded-full border bg-background transition-all hover:-translate-y-0.5 hover:shadow-md"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt={label} className="size-5" />
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-base font-semibold">Quick Links</h3>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.url}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h3 className="mb-4 text-base font-semibold">Account</h3>
            <ul className="flex flex-col gap-2.5">
              {accountLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.url}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 text-base font-semibold">Contact</h3>
            <ul className="flex flex-col gap-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Mail className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>support@medistore.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <Phone className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>+880 1234-567890</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="mt-0.5 size-4 shrink-0 text-primary" />
                <span>Dhaka, Bangladesh</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-center text-sm text-muted-foreground md:flex-row md:text-left">
          <p>© {new Date().getFullYear()} MediStore. All rights reserved.</p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-primary">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export { Footer };
