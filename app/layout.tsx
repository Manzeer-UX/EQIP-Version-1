import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Space_Grotesk } from "next/font/google";
import { footer, hero } from "@/lib/content";
import "./globals.css";

/* Typography (brand guide): Space Grotesk for display & headlines, Inter for text & interface,
   and a mono for labels. Accent words stay in the headline font, coloured blue. */
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
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
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
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
