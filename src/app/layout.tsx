import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Loop",
  description: "Loop the store for modern people",
  keywords: [
    "clothes",
    "clothing",
    "modern",
    "women",
    "men",
    "shopping",
    "online",
    "store",
    "shop",
    "fashion",
    "style",
    "trends",
  ],
  authors: [
    {
      name: "Alejandro Vidal",
      url: "https://github.com/alevidals",
    },
  ],
  creator: "Alejandro Vidal",
  openGraph: {
    type: "website",
    url: process.env.BASE_URL,
    title: "Loop",
    description: "Loop the store for modern people",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Loop",
      },
    ],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-white dark mx-12`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
