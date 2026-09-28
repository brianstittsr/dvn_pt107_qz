import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { Nav } from "@/components/nav";
import { SyncProvider } from "@/components/sync-provider";
import { Toaster } from "sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Part 107 Flight School",
  description: "Master the FAA Part 107 Remote Pilot exam with quizzes, vocabulary, and progress tracking.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-slate-50 text-slate-900">
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
