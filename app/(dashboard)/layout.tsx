import { BackgroundGradient } from "@/components/shared/background-gradient";
import { Sidebar } from "@/components/shared/sidebar";
import { Navbar } from "@/components/shared/navbar";
import { ContentWrapper } from "@/components/shared/content-wrapper";
import PrivateRouteGuard from "@/lib/private-routes";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PrivateRouteGuard>
      <BackgroundGradient variant="default" />
      <Navbar />
      <ContentWrapper>
        {children}
      </ContentWrapper>
      <Sidebar />
    </PrivateRouteGuard>
  );
}
