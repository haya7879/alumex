import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { ThemeProvider } from "@/providers/theme-provider";
import { BackgroundGradient } from "@/components/shared/background-gradient";
import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";
import { ContentWrapper } from "@/components/shared/content-wrapper";
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
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <body className={`${cairo.variable} antialiased`}>
        <ThemeProvider>
          <BackgroundGradient variant="default"  />
          <Navbar />
          <div className="flex min-h-screen justify-end" style={{marginTop:"60px"}}>
            <ContentWrapper>
              {children}
            </ContentWrapper>
            <Sidebar />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
