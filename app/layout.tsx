import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Sudhir Kumar | Lead Rust Developer & Payment Systems Expert",
  description: "Backend-focused Senior Software Engineer specializing in high-performance payment systems using Rust. Expertise in distributed systems, cloud architecture, and scalable backend solutions.",
  keywords: "Rust Developer, Payment Systems, Backend Engineer, Distributed Systems, Cloud Architecture, Kubernetes, Docker, AWS, PostgreSQL, MongoDB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Navigation />
        {children}
      </body>
    </html>
  );
}