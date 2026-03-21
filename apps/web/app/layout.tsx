import type { Metadata } from "next";
import "./globals.css";
import Logo from "../components/Logo/Logo";
import Head from "next/head";

export const metadata: Metadata = {
  title: "WellLink - Your Health, Connected",
  description:
    "Sync your Apple Health data, get AI-powered insights, and share with your doctor - all in one place.",
  icons: {
    icon: "/logo.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
