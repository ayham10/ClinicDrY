"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase, AppointmentStatus } from "@/lib/supabase";
import { format } from "date-fns";

const treatmentLabels: Record<string, string> = {
  "invisalign": "Invisalign",
  "botox-fillers": "Botox & Fillers",
  "implants-veneers": "Implants & Veneers",
  "general-dentistry": "General Dentistry",
};

const statusStyle: Record<string, { bg: string; color: string }> = {
  pending:   { bg: "rgba(245,158,11,0.12)",  color: "#F59E0B" },
  confirmed: { bg: "rgba(16,185,129,0.12)",  color: "#10B981" },
  cancelled: { bg: "rgba(239,68,68,0.12)",   color: "#EF4444" },
  completed: { bg: "rgba(107,114,128,0.12)", color: "#6B7280" },
  no_show:   { bg: "rgba(139,92,246,0.12)",  color: "#8B5CF6" },
};

const whatsappReminder = (phone: string, name: string, date: string, time: string, treatment: string) => {
  const msg = encodeURIComponent(`Hello ${name}! 👋\n\nReminder from Dr. Yara Salem's clinic.\n\n📅 *${date}* at *${time}*\n💊 *${treatment}*\n\nPlease confirm or call us to reschedule.\n📞 +972 54 799 7273`);
  window.open(`https://wa.me/${phone.replace(/\D/g, "")}?text=${msg}`, "_blank");
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterTreatment, setFilterTreatment] = useState("all");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editNotes, setEditNotes] = useState("");

  useEffect(() => { fetchAppointments(); }, []);

  useEffect(() => {
    let data = [...appointments];
    if (filterStatus !== "all") data = data.filter(a => a.status === filterStatus);
    if (filterTreatment !== "all") data = data.filter(a => a.treatment === filterTreatment);
    if (search) data = data.filter(a =>
      a.patient?.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.patient?.phone?.includes(search)
    );
    setFiltered(data);
  }, [appointments, filterStatus, filterTreatment, search]);

  async function fetchAppointments() {
    const { data } = await supabase
      .from("appointments")
      .select("*, patient:patients(*)")
      .order("date", { ascending: false })
      .order("time", { ascending: true });
    setAppointments(data || []);
    setFiltered(data || []);
    setLoading(false);
  }

  async function updateStatus(id: string, status: AppointmentStatus) {
    await supabase.from("appointments").update({ status }).eq("id", id);
    fetchAppointments();
  }

  async function saveReschedule(id: string) {
    await supabase.from("appointments").update({ date: editDate, time: editTime, notes: editNotes, status: "confirmed" }).eq("id", id);
    setEditingId(null);
    fetchAppointments();
  }

  const inp = { padding: "8px 12px", border: "0.5px solid rgba(0,0,0,0.15)", background: "white", fontFamily: "'Jost',sans-serif", fontSize: "12px", outline: "none" } as React.CSSProperties;

  return (
    <div style={{ padding: "40px 48px", minHeight: "100vh", background: "#F5F3EF" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "8px" }}>Clinic Management</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", fontWeight: 300, color: "#0F0F0F" }}>All <em style={{ fontStyle: "italic", color: "#D4621A" }}>Appointments</em></h1>
        </div>
        <Link href="/admin/appointments/new" style={{ fontSize: "11px", letterSpacing: "0.5px", textTransform: "none", background: "#D4621A", color: "#000000", padding: "12px 26px", textDecoration: "none", fontFamily: "'Karla',sans-serif", fontWeight: 600, border: "1px solid #A84D12", borderRadius: 0 }}>
          + New Appointment
        </Link>
      </div>

      {/* Filters */}
      <div style={{ background: "white", padding: "20px 24px", border: "0.5px solid rgba(0,0,0,0.06)", marginBottom: "16px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center" }}>
        <input placeholder="Search patient name or phone..." value={search} onChange={e => setSearch(e.target.value)}
          style={{ ...inp, flex: 1, minWidth: "200px", padding: "10px 14px" }} />
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} style={inp}>
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="no_show">No Show</option>
        </select>
        <select value={filterTreatment} onChange={e => setFilterTreatment(e.target.value)} style={inp}>
          <option value="all">All Treatments</option>
          <option value="invisalign">Invisalign</option>
          <option value="botox-fillers">Botox & Fillers</option>
          <option value="implants-veneers">Implants & Veneers</option>
          <option value="general-dentistry">General Dentistry</option>
        </select>
        <div style={{ fontSize: "11px", color: "#888" }}>{filtered.length} results</div>
      </div>

      {/* Table */}
      <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.06)" }}>
        {/* Table header */}
        <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 160px 120px 130px 260px", padding: "14px 24px", borderBottom: "0.5px solid rgba(0,0,0,0.08)", background: "#FAFAF8" }}>
          {["Date & Time", "Patient", "Treatment", "Status", "Reminder Sent", "Actions"].map(h => (
            <div key={h} style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#888" }}>{h}</div>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#aaa", fontFamily: "'Cormorant Garamond',serif", fontSize: "20px" }}>Loading appointments...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#aaa", fontFamily: "'Cormorant Garamond',serif", fontSize: "20px" }}>No appointments found</div>
        ) : filtered.map((appt, i) => {
          const s = statusStyle[appt.status] || statusStyle.pending;
          const isEditing = editingId === appt.id;

          return (
            <div key={appt.id}>
              <div style={{
                display: "grid", gridTemplateColumns: "120px 1fr 160px 120px 130px 260px",
                padding: "18px 24px", gap: "12px", alignItems: "center",
                borderBottom: i < filtered.length - 1 ? "0.5px solid rgba(0,0,0,0.05)" : "none",
                background: isEditing ? "rgba(212,98,26,0.03)" : "white",
              }}>
                {/* Date & Time */}
                <div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", color: "#D4621A" }}>{appt.time?.slice(0,5)}</div>
                  <div style={{ fontSize: "11px", color: "#888" }}>{appt.date ? format(new Date(appt.date), "MMM d, yyyy") : ""}</div>
                </div>

                {/* Patient */}
                <div>
                  <Link href={`/admin/patients/${appt.patient_id}`} style={{ fontWeight: 500, fontSize: "14px", color: "#0F0F0F", textDecoration: "none" }}>
                    {appt.patient?.full_name}
                  </Link>
                  <div style={{ fontSize: "11px", color: "#888" }}>{appt.patient?.phone}</div>
                  {appt.notes && <div style={{ fontSize: "11px", color: "#aaa", marginTop: "2px", fontStyle: "italic" }}>📝 {appt.notes}</div>}
                </div>

                {/* Treatment */}
                <div style={{ fontSize: "12px", color: "#555" }}>{treatmentLabels[appt.treatment]}</div>

                {/* Status */}
                <div>
                  <span style={{ background: s.bg, color: s.color, fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", padding: "5px 10px" }}>
                    {appt.status}
                  </span>
                </div>

                {/* Reminder */}
                <div style={{ fontSize: "11px", color: appt.reminder_sent ? "#10B981" : "#ccc" }}>
                  {appt.reminder_sent ? "✓ Sent" : "Not sent"}
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {appt.status === "pending" && (
                    <button onClick={() => updateStatus(appt.id, "confirmed")} style={{ fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", background: "rgba(16,185,129,0.1)", color: "#10B981", border: "0.5px solid rgba(16,185,129,0.3)", padding: "6px 10px", cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>Confirm</button>
                  )}
                  <button onClick={() => { setEditingId(isEditing ? null : appt.id); setEditDate(appt.date); setEditTime(appt.time?.slice(0,5)); setEditNotes(appt.notes || ""); }}
                    style={{ fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", background: "rgba(59,130,246,0.1)", color: "#3B82F6", border: "0.5px solid rgba(59,130,246,0.3)", padding: "6px 10px", cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>
                    Reschedule
                  </button>
                  <button onClick={() => { whatsappReminder(appt.patient?.phone, appt.patient?.full_name, appt.date, appt.time?.slice(0,5), treatmentLabels[appt.treatment]); supabase.from("appointments").update({ reminder_sent: true }).eq("id", appt.id).then(() => fetchAppointments()); }}
                    style={{ fontSize: "9px", background: "rgba(37,211,102,0.1)", color: "#25D366", border: "0.5px solid rgba(37,211,102,0.3)", padding: "6px 10px", cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>
                    WhatsApp
                  </button>
                  {appt.status !== "cancelled" && (
                    <button onClick={() => updateStatus(appt.id, "cancelled")} style={{ fontSize: "9px", background: "rgba(239,68,68,0.08)", color: "#EF4444", border: "0.5px solid rgba(239,68,68,0.2)", padding: "6px 10px", cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>Cancel</button>
                  )}
                  {appt.status === "confirmed" && (
                    <button onClick={() => updateStatus(appt.id, "no_show")} style={{ fontSize: "9px", background: "rgba(139,92,246,0.08)", color: "#8B5CF6", border: "0.5px solid rgba(139,92,246,0.2)", padding: "6px 10px", cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>No Show</button>
                  )}
                </div>
              </div>

              {/* Inline reschedule form */}
              {isEditing && (
                <div style={{ padding: "20px 24px 20px 156px", background: "rgba(212,98,26,0.04)", borderBottom: "0.5px solid rgba(212,98,26,0.1)", display: "flex", gap: "16px", alignItems: "flex-end" }}>
                  <div>
                    <label style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "6px" }}>New Date</label>
                    <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} style={inp} />
                  </div>
                  <div>
                    <label style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "6px" }}>New Time</label>
                    <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} style={inp} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={{ fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#888", display: "block", marginBottom: "6px" }}>Note (optional)</label>
                    <input type="text" placeholder="Reason for reschedule..." value={editNotes} onChange={e => setEditNotes(e.target.value)} style={{ ...inp, width: "100%" }} />
                  </div>
                  <button onClick={() => saveReschedule(appt.id)} style={{ background: "#D4621A", color: "#000000", border: "1px solid #A84D12", padding: "8px 20px", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Karla',sans-serif", fontWeight: 600 }}>Save</button>
                  <button onClick={() => setEditingId(null)} style={{ background: "none", color: "#888", border: "0.5px solid rgba(0,0,0,0.15)", padding: "8px 16px", fontSize: "10px", cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>Cancel</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
