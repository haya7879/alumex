import { BackgroundGradient } from "@/components/shared/background-gradient";
import PublicRouteGuard from "@/lib/public-routes";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <PublicRouteGuard>
      <BackgroundGradient variant="default" />
      <div className="min-h-screen flex items-center justify-center">
        {children}
      </div>
    </PublicRouteGuard>
  );
}
