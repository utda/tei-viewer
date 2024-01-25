import type { Metadata } from "next";
import "./globals.css";
import "./CETEIcean.css";

const siteName = "TEI Viewer";
const description = "TEI/XML Simple Viewer";
const url = "https://nakamura196.github.io/tei-viewer/";

export const metadata: Metadata = {
  title: siteName,
  description,
  openGraph: {
    title: siteName,
    description,
    url,
    siteName,
    locale: "ja_JP",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: siteName,
    description,
  },
  alternates: {
    canonical: url,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
