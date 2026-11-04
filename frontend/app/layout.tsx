import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/common/Footer";
import { Header } from "@/components/common/Header";
import { BagProvider } from "@/components/common/BagProvider";
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
  title: "Bliss & Bless | Make room for the good things",
  description:
    "Thoughtful experiences and timeless details for life's most beautiful celebrations.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex-col min-h-full flex">
        <BagProvider>
          <Header />
          {children}
          <Footer />
        </BagProvider>
      </body>
    </html>
  );
}
