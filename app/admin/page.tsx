"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, Appointment, AppointmentStatus } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { format } from "date-fns";

const treatmentLabels: Record<string, string> = {
  "invisalign": "Invisalign",
  "botox-fillers": "Botox & Fillers",
  "implants-veneers": "Implants & Veneers",
  "general-dentistry": "General Dentistry",
};

const statusStyle: Record<AppointmentStatus, { bg: string; color: string; label: string }> = {
  pending:   { bg: "rgba(245,158,11,0.12)",  color: "#F59E0B", label: "Pending" },
  confirmed: { bg: "rgba(16,185,129,0.12)",  color: "#10B981", label: "Confirmed" },
  cancelled: { bg: "rgba(239,68,68,0.12)",   color: "#EF4444", label: "Cancelled" },
  completed: { bg: "rgba(107,114,128,0.12)", color: "#6B7280", label: "Completed" },
  no_show:   { bg: "rgba(139,92,246,0.12)",  color: "#8B5CF6", label: "No Show" },
};

const whatsappReminder = (phone: string, name: string, date: string, time: string, treatment: string) => {
  const msg = encodeURIComponent(
    `Hello ${name}! 👋\n\nThis is a reminder from Dr. Yara Salem's clinic.\n\nYour appointment is scheduled for:\n📅 *${date}* at *${time}*\n💊 Treatment: *${treatment}*\n\nPlease confirm or contact us if you need to reschedule.\n\n📍 Deir Hanna Clinic\n📞 +972 54 799 7273`
  );
  window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${msg}`, "_blank");
};

export default function AdminDashboard() {
  const { user, role } = useAuth();
  const [todayAppts, setTodayAppts] = useState<any[]>([]);
  const [stats, setStats] = useState({ today: 0, week: 0, month: 0, pending: 0 });
  const [loading, setLoading] = useState(true);

  const today = format(new Date(), "yyyy-MM-dd");
  const greeting = new Date().getHours() < 12 ? "Good morning" : new Date().getHours() < 17 ? "Good afternoon" : "Good evening";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  async function fetchDashboardData() {
    const now = new Date();
    const weekStart = format(new Date(now.setDate(now.getDate() - now.getDay())), "yyyy-MM-dd");
    const monthStart = format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd");

    const [todayRes, weekRes, monthRes, pendingRes] = await Promise.all([
      supabase.from("appointments").select("*, patient:patients(*)").eq("date", today).order("time"),
      supabase.from("appointments").select("id", { count: "exact" }).gte("date", weekStart),
      supabase.from("appointments").select("id", { count: "exact" }).gte("date", monthStart),
      supabase.from("appointments").select("id", { count: "exact" }).eq("status", "pending"),
    ]);

    setTodayAppts(todayRes.data || []);
    setStats({
      today: todayRes.data?.length || 0,
      week: weekRes.count || 0,
      month: monthRes.count || 0,
      pending: pendingRes.count || 0,
    });
    setLoading(false);
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    await supabase.from("appointments").update({ status }).eq("id", id);
    fetchDashboardData();
  }

  const statCards = [
    { label: "Today", value: stats.today, color: "#D4621A", sub: format(new Date(), "EEEE, MMM d") },
    { label: "This Week", value: stats.week, color: "#10B981", sub: "Appointments" },
    { label: "This Month", value: stats.month, color: "#3B82F6", sub: format(new Date(), "MMMM yyyy") },
    { label: "Pending", value: stats.pending, color: "#F59E0B", sub: "Need confirmation" },
  ];

  return (
    <div style={{ padding: "40px 48px", minHeight: "100vh", background: "#F5F3EF" }}>
      {/* Header */}
      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "8px" }}>
          {format(new Date(), "EEEE, MMMM d, yyyy")}
        </div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", fontWeight: 300, color: "#0F0F0F" }}>
          {greeting}, <em style={{ fontStyle: "italic", color: "#D4621A" }}>{role === "doctor" ? "Dr. Yara" : "Welcome"}</em>
        </h1>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "40px" }}>
        {statCards.map(s => (
          <div key={s.label} style={{ background: "white", padding: "28px 24px", border: "0.5px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#888", marginBottom: "12px" }}>{s.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "48px", fontWeight: 300, color: s.color, lineHeight: 1 }}>{loading ? "—" : s.value}</div>
            <div style={{ fontSize: "11px", color: "#aaa", marginTop: "8px" }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Today's Appointments */}
      <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.06)" }}>
        <div style={{ padding: "24px 32px", borderBottom: "0.5px solid rgba(0,0,0,0.06)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "4px" }}>Today's Schedule</div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", fontWeight: 300, color: "#0F0F0F" }}>
              {stats.today} Appointment{stats.today !== 1 ? "s" : ""}
            </h2>
          </div>
          <Link href="/admin/appointments/new" style={{
            fontSize: "11px", letterSpacing: "0.5px", textTransform: "none",
            background: "#D4621A", color: "#000000", padding: "12px 22px", border: "1px solid #A84D12", borderRadius: 0,
            textDecoration: "none", fontFamily: "'Karla',sans-serif", fontWeight: 600,
          }}>
            + Add Appointment
          </Link>
        </div>

        {loading ? (
          <div style={{ padding: "48px", textAlign: "center", color: "#888", fontFamily: "'Cormorant Garamond',serif", fontSize: "20px" }}>Loading...</div>
        ) : todayAppts.length === 0 ? (
          <div style={{ padding: "48px", textAlign: "center" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", color: "#ccc", marginBottom: "8px" }}>No appointments today</div>
            <Link href="/admin/appointments/new" style={{ fontSize: "11px", color: "#D4621A", textDecoration: "none" }}>Schedule one →</Link>
          </div>
        ) : (
          <div>
            {todayAppts.map((appt, i) => {
              const s = statusStyle[appt.status as AppointmentStatus] || statusStyle.pending;
              return (
                <div key={appt.id} style={{
                  display: "grid", gridTemplateColumns: "80px 1fr 180px 200px",
                  alignItems: "center", padding: "20px 32px", gap: "24px",
                  borderBottom: i < todayAppts.length - 1 ? "0.5px solid rgba(0,0,0,0.05)" : "none",
                  transition: "background 0.2s",
                }}>
                  {/* Time */}
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", color: "#D4621A", fontWeight: 300 }}>
                    {appt.time?.slice(0, 5)}
                  </div>

                  {/* Patient + Treatment */}
                  <div>
                    <div style={{ fontWeight: 500, fontSize: "14px", color: "#0F0F0F", marginBottom: "2px" }}>
                      {appt.patient?.full_name || "Unknown Patient"}
                    </div>
                    <div style={{ fontSize: "11px", color: "#888" }}>
                      {treatmentLabels[appt.treatment]} · {appt.patient?.phone}
                    </div>
                  </div>

                  {/* Status */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ background: s.bg, color: s.color, fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", padding: "6px 12px" }}>
                      {s.label}
                    </span>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: "8px" }}>
                    {appt.status === "pending" && (
                      <button onClick={() => updateStatus(appt.id, "confirmed")} style={{
                        fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase",
                        background: "rgba(16,185,129,0.1)", color: "#10B981",
                        border: "0.5px solid rgba(16,185,129,0.3)", padding: "7px 14px",
                        cursor: "pointer", fontFamily: "'Jost',sans-serif",
                      }}>
                        Confirm
                      </button>
                    )}
                    {appt.status === "confirmed" && (
                      <button onClick={() => updateStatus(appt.id, "completed")} style={{
                        fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase",
                        background: "rgba(107,114,128,0.1)", color: "#6B7280",
                        border: "0.5px solid rgba(107,114,128,0.3)", padding: "7px 14px",
                        cursor: "pointer", fontFamily: "'Jost',sans-serif",
                      }}>
                        Complete
                      </button>
                    )}
                    <button
                      onClick={() => whatsappReminder(appt.patient?.phone, appt.patient?.full_name, appt.date, appt.time?.slice(0,5), treatmentLabels[appt.treatment])}
                      style={{
                        fontSize: "10px", letterSpacing: "1px",
                        background: "rgba(37,211,102,0.1)", color: "#25D366",
                        border: "0.5px solid rgba(37,211,102,0.3)", padding: "7px 12px",
                        cursor: "pointer", fontFamily: "'Jost',sans-serif",
                        display: "flex", alignItems: "center", gap: "4px",
                      }}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                      Remind
                    </button>
                    {appt.status !== "cancelled" && (
                      <button onClick={() => updateStatus(appt.id, "cancelled")} style={{
                        fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase",
                        background: "rgba(239,68,68,0.08)", color: "#EF4444",
                        border: "0.5px solid rgba(239,68,68,0.2)", padding: "7px 12px",
                        cursor: "pointer", fontFamily: "'Jost',sans-serif",
                      }}>
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick nav */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginTop: "24px" }}>
        {[
          { href: "/admin/appointments", label: "All Appointments", desc: "View & manage every booking", icon: "📅" },
          { href: "/admin/patients", label: "Patient Records", desc: "History, notes & contacts", icon: "👤" },
          { href: "/admin/analytics", label: "Analytics", desc: "Monthly reports & charts", icon: "📊" },
        ].map(item => (
          <Link key={item.href} href={item.href} style={{
            textDecoration: "none", background: "white",
            border: "0.5px solid rgba(0,0,0,0.06)", padding: "28px 24px",
            display: "block", transition: "all 0.2s",
          }}>
            <div style={{ fontSize: "24px", marginBottom: "12px" }}>{item.icon}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", color: "#0F0F0F", marginBottom: "6px" }}>{item.label}</div>
            <div style={{ fontSize: "12px", color: "#888" }}>{item.desc}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
