"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: "⬛" },
  { href: "/admin/appointments", label: "Appointments", icon: "📅" },
  { href: "/admin/calendar", label: "Calendar", icon: "🗓" },
  { href: "/admin/patients", label: "Patients", icon: "👤" },
  { href: "/admin/analytics", label: "Analytics", icon: "📊" },
];

const statusColors: Record<string, string> = {
  pending: "#F59E0B",
  confirmed: "#10B981",
  cancelled: "#EF4444",
  completed: "#6B7280",
  no_show: "#8B5CF6",
};

export { statusColors };

export default function AdminSidebar() {
  const pathname = usePathname();
  const { user, role, signOut } = useAuth();

  return (
    <aside style={{
      width: "240px", minHeight: "100vh", background: "#0F0F0F",
      display: "flex", flexDirection: "column",
      borderRight: "0.5px solid rgba(255,255,255,0.06)",
      position: "fixed", top: 0, left: 0, zIndex: 100,
    }}>
      {/* Logo */}
      <div style={{ padding: "28px 24px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", color: "white", fontWeight: 300 }}>
          Dr. <span style={{ color: "#D4621A" }}>Yara Salem</span>
        </div>
        <div style={{ fontSize: "9px", letterSpacing: "2.5px", textTransform: "uppercase", color: "#555", marginTop: "4px" }}>
          Clinic Dashboard
        </div>
      </div>

      {/* Role badge */}
      <div style={{ padding: "16px 24px", borderBottom: "0.5px solid rgba(255,255,255,0.06)" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "8px",
          fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase",
          background: role === "doctor" ? "rgba(212,98,26,0.15)" : "rgba(255,255,255,0.06)",
          color: role === "doctor" ? "#D4621A" : "#888",
          padding: "6px 12px",
        }}>
          <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: role === "doctor" ? "#D4621A" : "#888", display: "block" }} />
          {role === "doctor" ? "Doctor" : "Secretary"}
        </div>
        <div style={{ fontSize: "11px", color: "#555", marginTop: "8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {user?.email}
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "16px 0" }}>
        {navItems.map((item) => {
          const active = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href} style={{
              display: "flex", alignItems: "center", gap: "12px",
              padding: "12px 24px",
              background: active ? "rgba(212,98,26,0.12)" : "transparent",
              borderLeft: active ? "2px solid #D4621A" : "2px solid transparent",
              color: active ? "#D4621A" : "#666",
              textDecoration: "none",
              fontSize: "12px", letterSpacing: "0.5px",
              transition: "all 0.2s",
            }}>
              <span style={{ fontSize: "14px" }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Quick add */}
      <div style={{ padding: "16px 24px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        <Link href="/admin/appointments/new" style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
          background: "#D4621A", color: "#000000", padding: "12px", border: "1px solid #A84D12", fontWeight: 600,
          textDecoration: "none", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
          fontFamily: "'Jost',sans-serif", fontWeight: 500,
        }}>
          + New Appointment
        </Link>
      </div>

      {/* Sign out */}
      <div style={{ padding: "16px 24px", borderTop: "0.5px solid rgba(255,255,255,0.06)" }}>
        <button onClick={signOut} style={{
          width: "100%", background: "none", border: "0.5px solid rgba(255,255,255,0.1)",
          color: "#555", padding: "10px", fontSize: "11px", letterSpacing: "1.5px",
          textTransform: "uppercase", cursor: "pointer", fontFamily: "'Jost',sans-serif",
          transition: "all 0.2s",
        }}>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
