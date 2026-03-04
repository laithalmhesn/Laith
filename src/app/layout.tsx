import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GasNow Jordan | غاز ناو الأردن",
  description: "Order gas cylinders delivered to your door in Jordan | اطلب أسطوانات الغاز لتوصيلها إلى بابك في الأردن",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
