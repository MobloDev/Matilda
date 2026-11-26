import type { Metadata } from "next";
import { Lato } from "next/font/google";
import "./globals.css";

// NOVA's brand typeface is Calibri (Microsoft-licensed — we can't bundle
// it). Lato is the closest open, Google-hosted substitute in the same
// calm, humanist-sans register; "Calibri" is still named first in the
// CSS font stack (globals.css) so it renders for anyone with Office
// installed.
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700"],
});

export const metadata: Metadata = {
  title: "MATILDA",
  description: "NOVA's Account Management Operating System prototype",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
