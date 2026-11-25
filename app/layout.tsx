import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { footer, hero } from "@/lib/content";
import "./globals.css";

/* Typography: characterful display grotesque, an italic serif accent, a crisp text sans and a mono for labels. */
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", axes: ["opsz"], display: "swap" });
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-serif", display: "swap" });
const sans = Geist({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  title: `EQIP — ${hero.title.replace(/\*/g, "").replace(/ /g, " ")}`,
  description: footer.line,
};

export const viewport: Viewport = {
  themeColor: "#070A12",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${display.variable} ${serif.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Enables entrance animations only when JS is running, so content never stays hidden without it. */}
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
