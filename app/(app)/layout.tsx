import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { Nav } from "@/components/nav";
import { SyncProvider } from "@/components/sync-provider";
import { Toaster } from "sonner";
import "../globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-100 text-slate-900">
        <AuthProvider>
          <SyncProvider>
            <div className="flex min-h-screen">
              <Nav />
              <main className="flex-1 overflow-auto p-8">{children}</main>
            </div>
            <Toaster position="bottom-right" />
          </SyncProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
