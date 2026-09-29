import { AuthProvider } from "@/components/auth-provider";
import { Nav } from "@/components/nav";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SyncProvider } from "@/components/sync-provider";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SyncProvider>
        <div className="flex min-h-screen bg-background text-foreground">
          <Nav />
          <div className="flex min-h-screen flex-1 flex-col">
            <SiteHeader variant="compact" />
            <main className="flex-1 overflow-auto p-8">{children}</main>
            <SiteFooter />
          </div>
        </div>
        <Toaster position="bottom-right" />
      </SyncProvider>
    </AuthProvider>
  );
}
