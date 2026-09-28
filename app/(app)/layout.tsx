import { AuthProvider } from "@/components/auth-provider";
import { Nav } from "@/components/nav";
import { SyncProvider } from "@/components/sync-provider";
import { Toaster } from "sonner";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <SyncProvider>
        <div className="flex min-h-screen bg-slate-100 text-slate-900">
          <Nav />
          <main className="flex-1 overflow-auto p-8">{children}</main>
        </div>
        <Toaster position="bottom-right" />
      </SyncProvider>
    </AuthProvider>
  );
}
