import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Good Showroom DMS",
  description: "Good Showroom dealer management system — workstation preview.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-neutral-50 text-neutral-900">{children}</body>
    </html>
  );
}
