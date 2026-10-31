import { Newsreader, Plus_Jakarta_Sans, Instrument_Serif} from "next/font/google";
import "./globals.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://reverienote.vercel.app"),
  title: {
    default: "Reverie — A quiet space to write your thoughts",
    template: "%s | Reverie",
  },
  description:
    "Reverie is a quiet space to write your thoughts, and an AI right there to think through them with you. Write freely, reflect deeply, and work through your ideas with a companion that actually reads what you wrote.",
  keywords: ["Reverie", "Reverie notes", "journaling app", "AI journal", "thought companion", "reflective writing"],
  openGraph: {
    title: "Reverie — A quiet space to write your thoughts",
    description:
      "Write freely. Think together. An AI journaling companion that reflects with you, not just a notes app.",
    url: "https://reverienote.vercel.app",
    siteName: "Reverie",
    images: [{ url: "/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reverie — A quiet space to write your thoughts",
    description: "An AI journaling companion that thinks through your thoughts with you.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument-serif",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`${newsreader.variable} ${jakarta.variable} ${instrumentSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
