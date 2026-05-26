import type { Metadata } from "next";
import { Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

const notoSans = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  variable: "--font-noto-sans-jp",
  display: "swap",
});

const notoSerif = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-noto-serif-jp",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://kanjii.app"),
  title: "Learn Japanese Kanji Skills | Kanjii",
  description:
    "Kanjii teaches you to write Japanese like a native. Type real sentences with a Japanese IME, build your personal kanji library, and progress through JLPT levels.",
  openGraph: {
    title: "Learn Japanese Kanji Skills | Kanjii",
    description:
      "Learn Japanese the way it's actually used. Type real sentences, build your kanji library, and progress from N5 to N1.",
    url: "https://kanjii.app",
    siteName: "Kanjii",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Learn Japanese Kanji Skills | Kanjii",
    description:
      "Learn Japanese the way it's actually used. Type real sentences with a Japanese IME.",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${notoSans.variable} ${notoSerif.variable}`}>
        {children}
      </body>
    </html>
  );
}
