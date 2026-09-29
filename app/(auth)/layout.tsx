import { AuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "sonner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <div className="relative flex min-h-screen flex-col bg-background text-foreground">
        <div className="pointer-events-none absolute inset-0 camo-pattern" aria-hidden="true" />
        <SiteHeader />
        <main className="relative z-10 flex-1">{children}</main>
        <SiteFooter />
        <Toaster position="bottom-right" />
      </div>
    </AuthProvider>
  );
}
