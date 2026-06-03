import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "@/app/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
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
    <html lang="en" className={`${poppins.variable} ${tanTangkiwood.variable}`}>
      <body>
        <Navbar />
        <main style={{ padding: "0 1rem", flex: 1 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
