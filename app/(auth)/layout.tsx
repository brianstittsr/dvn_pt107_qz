import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <main className="min-h-screen bg-background text-foreground">{children}</main>
      <Toaster position="bottom-right" />
    </AuthProvider>
  );
}
