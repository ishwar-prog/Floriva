import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const brodine = localFont({
  src: "../public/fonts/brodine-regular.woff2",
  variable: "--font-brodine",
  display: "swap",
});

export const metadata: Metadata = {
  title: "floriva — photographic showcase",
  description: "a modern animated photographic showcase portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${brodine.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#020704] text-white selection:bg-[#a3c73c] selection:text-black">
        {children}
      </body>
    </html>
  );
}
