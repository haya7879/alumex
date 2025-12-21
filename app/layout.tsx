import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { BackgroundGradient } from "@/components/shared/background-gradient";
import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";
import "./globals.css";

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["latin", "arabic"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Alumex",
  description: "Alumex is a platform for managing your business",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${cairo.variable} antialiased`}>
        <ThemeProvider>
          <BackgroundGradient variant="purple" />
          <div className="flex h-full">
            <div className="flex flex-col w-full h-full transition-all p-4 pt-0 max-w-[calc(100vw-100px)]">
              {/* <Navbar /> */}
              {children}
            </div>
            <Sidebar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
