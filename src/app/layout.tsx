import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./providers/ThemeProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";

/* ── Body font (UI, buttons, body copy) ─────────────────────── */
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-plus-jakarta-sans",
  display: "swap",
});

/* ── Display / heading font (heroes, titles, quotes, logo) ──── */
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

/* ── Mono font (labels, metadata, prices, tags) ─────────────── */
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "GreenRoots — Rooted in Nature, Delivered to You",
    template: "%s | GreenRoots",
  },
  description:
    "Herbalist-curated organic products, herbal remedies and natural wellness essentials — harvested from field to jar and delivered to your door.",
  keywords: ["herbal", "organic", "natural", "herbs", "wellness", "remedies", "GreenRoots"],
  openGraph: {
    title: "GreenRoots — Rooted in Nature, Delivered to You",
    description:
      "Herbalist-curated organic products and natural wellness essentials delivered to your door.",
    siteName: "GreenRoots",
    locale: "en_BD",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${cormorantGaramond.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning={true}
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            {children}
            <Toaster richColors position="top-center" />
          </TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
