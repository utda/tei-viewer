import type { Metadata } from "next";
import "./globals.css";
import "./CETEIcean.css";

export const metadata: Metadata = {
  title: "TEI Viewer",
  description: "TEI Viewer",
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
