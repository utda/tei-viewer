import type { Metadata } from "next";
import "./globals.css";
import "./CETEIcean.css";

const siteName = "TEI Viewer";
const description = "TEI/XML Simple Viewer";
const origin = "https://nakamura196.github.io";

const prefixPath = process.env.prefixPath;
const url = `${origin}${prefixPath}/`;

export const metadata: Metadata = {
  metadataBase: new URL(origin),
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
