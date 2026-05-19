import type { Metadata } from "next";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const tanTangkiwood = localFont({
  src: "../fonts/TAN-Tangkiwood-Regular.ttf",
  variable: "--font-tan-tangkiwood",
});

export const metadata: Metadata = {
  title: "Red Dragon Social Club",
  description: "Mahjong Club Red Dragon Social Club",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${tanTangkiwood.variable}`}>
      <body style={{ fontFamily: "var(--font-inter)" }}>
        <Navbar />
        <main style={{ padding: "0 1rem", flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
