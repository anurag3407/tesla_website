import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";
import VisitTracker from '@/components/VisitTracker';

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "TESLA Technical Club | Innovate. Build. Inspire.",
  description: "TESLA Technical Club is a community of passionate learners, innovators and problem solvers building the future through technology.",
  manifest: '/manifest.json',
  themeColor: '#03030b',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'TESLA',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
        <VisitTracker />
        <main className="flex-grow">
          {children}
        </main>
      </body>
    </html>
  );
}
