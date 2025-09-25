import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "QR Generator - Free QR Code Generator",
  description: "Create QR codes instantly for URLs, text, or any data you need. Completely free, open-source, and privacy-focused QR code generator.",
  keywords: ["QR kod", "QR code", "generator", "generator", "free", "open-source"],
  authors: [{ name: "QR Generator" }],
  openGraph: {
    title: "QR Generator - Free QR Code Generator",
    description: "Create QR codes instantly for URLs, text, or any data you need. Completely free, open-source, and privacy-focused QR code generator.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
