import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import MaintenanceGuard from "@/components/MaintenanceGuard";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: {
    template: "%s | JHSSI Journal",
    default: "Journal of Humanities & Social Sciences Invention",
  },
  description: "An international, peer-reviewed, open-access interdisciplinary journal",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
        <AuthProvider>
          <MaintenanceGuard>{children}</MaintenanceGuard>
        </AuthProvider>
      </body>
    </html>
  );
}