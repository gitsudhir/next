import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Matrix Control | ESP32 LED Matrix",
  description: "Control your MAX7219 8x8 LED matrix connected to ESP32",
};

export default function MatrixLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-gray-50">{children}</div>;
}