"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import AdminSidebar from "@/components/admin/Sidebar";

function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (loading) return;
    // If not logged in and not on login page → go to login
    if (!user && !isLoginPage) router.push("/admin/login");
    // If already logged in and on login page → go to dashboard
    if (user && isLoginPage) router.push("/admin");
  }, [user, loading, isLoginPage, router]);

  // Login page: render directly, no sidebar, no guard
  if (isLoginPage) {
    return <>{children}</>;
  }

  // Loading state for protected pages
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F0F0F", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "28px", color: "white", fontWeight: 300 }}>
            Dr. <span style={{ color: "#D4621A" }}>Yara Salem</span>
          </div>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#555", marginTop: "16px" }}>
            Loading...
          </div>
        </div>
      </div>
    );
  }

  // Not logged in — blank while redirecting
  if (!user) return null;

  // Logged in — show sidebar + content
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F5F3EF" }}>
      <AdminSidebar />
      <main style={{ marginLeft: "240px", flex: 1, minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <AdminGuard>{children}</AdminGuard>
    </AuthProvider>
  );
}
