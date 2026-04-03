import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  title: "AI Fake News Detector Romania",
  description:
    "AI-powered fake news detector for Romanian content with real-time credibility analysis.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={manrope.variable}>
      <body className="min-h-screen overflow-x-hidden">{children}</body>
    </html>
  );
}
