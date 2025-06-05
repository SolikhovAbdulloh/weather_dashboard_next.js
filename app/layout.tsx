import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "App_weather",
  description: "Created with Solikhov",
  generator: "Solikh.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
