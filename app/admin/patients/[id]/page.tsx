"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

const treatmentLabels: Record<string, string> = {
  "invisalign": "Invisalign", "botox-fillers": "Botox & Fillers",
  "implants-veneers": "Implants & Veneers", "general-dentistry": "General Dentistry",
};
const statusStyle: Record<string, { bg: string; color: string }> = {
  pending:   { bg: "rgba(245,158,11,0.12)",  color: "#F59E0B" },
  confirmed: { bg: "rgba(16,185,129,0.12)",  color: "#10B981" },
  cancelled: { bg: "rgba(239,68,68,0.12)",   color: "#EF4444" },
  completed: { bg: "rgba(107,114,128,0.12)", color: "#6B7280" },
  no_show:   { bg: "rgba(139,92,246,0.12)",  color: "#8B5CF6" },
};

export default function PatientProfilePage() {
  const params = useParams();
  const id = params?.id as string;
  const [patient, setPatient] = useState<any>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (id) fetchPatient(); }, [id]);

  async function fetchPatient() {
    const [{ data: p }, { data: a }] = await Promise.all([
      supabase.from("patients").select("*").eq("id", id).single(),
      supabase.from("appointments").select("*").eq("patient_id", id).order("date", { ascending: false }),
    ]);
    setPatient(p);
    setNote(p?.notes || "");
    setAppointments(a || []);
    setLoading(false);
  }

  async function saveNotes() {
    setSaving(true);
    await supabase.from("patients").update({ notes: note }).eq("id", id);
    setSaving(false);
    alert("Notes saved ✓");
  }

  if (loading) return <div style={{ padding: "80px", textAlign: "center", color: "#aaa", fontFamily: "'Cormorant Garamond',serif", fontSize: "24px" }}>Loading...</div>;
  if (!patient) return <div style={{ padding: "80px", textAlign: "center", color: "#aaa" }}>Patient not found.</div>;

  const completed = appointments.filter(a => a.status === "completed").length;
  const upcoming = appointments.filter(a => ["pending", "confirmed"].includes(a.status) && new Date(a.date) >= new Date()).length;
  const mostUsed = appointments.reduce((acc: Record<string, number>, a) => { acc[a.treatment] = (acc[a.treatment] || 0) + 1; return acc; }, {});
  const topTreatment = Object.entries(mostUsed).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div style={{ padding: "40px 48px", minHeight: "100vh", background: "#F5F3EF" }}>
      {/* Back */}
      <Link href="/admin/patients" style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#888", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "32px" }}>
        ← All Patients
      </Link>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "24px", marginBottom: "40px" }}>
        <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#D4621A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond',serif", fontSize: "32px", color: "#000000", border: "1px solid #A84D12" }}>
          {patient.full_name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", fontWeight: 300, color: "#0F0F0F", marginBottom: "4px" }}>{patient.full_name}</h1>
          <div style={{ fontSize: "13px", color: "#888" }}>{patient.phone} {patient.email && `· ${patient.email}`}</div>
          <div style={{ fontSize: "11px", color: "#aaa", marginTop: "4px" }}>Patient since {format(new Date(patient.created_at), "MMMM yyyy")} · Source: {patient.source}</div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <a href={`https://wa.me/${patient.phone?.replace(/\D/g, "")}`} target="_blank" rel="noreferrer"
            style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#25D366", color: "white", padding: "12px 24px", textDecoration: "none", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Jost',sans-serif" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            WhatsApp
          </a>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
        {/* Left: Appointment history */}
        <div>
          <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.06)", marginBottom: "24px" }}>
            <div style={{ padding: "20px 28px", borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "4px" }}>Appointment History</div>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 300, color: "#0F0F0F" }}>{appointments.length} total visits</div>
            </div>
            {appointments.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", color: "#ccc", fontFamily: "'Cormorant Garamond',serif", fontSize: "18px" }}>No appointments yet</div>
            ) : appointments.map((appt, i) => {
              const s = statusStyle[appt.status] || statusStyle.pending;
              return (
                <div key={appt.id} style={{ display: "grid", gridTemplateColumns: "100px 1fr 120px", gap: "16px", padding: "16px 28px", alignItems: "center", borderBottom: i < appointments.length - 1 ? "0.5px solid rgba(0,0,0,0.05)" : "none" }}>
                  <div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "16px", color: "#D4621A" }}>{appt.time?.slice(0,5)}</div>
                    <div style={{ fontSize: "11px", color: "#aaa" }}>{appt.date ? format(new Date(appt.date), "MMM d, yyyy") : ""}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: "13px", color: "#333" }}>{treatmentLabels[appt.treatment]}</div>
                    {appt.notes && <div style={{ fontSize: "11px", color: "#aaa", fontStyle: "italic" }}>📝 {appt.notes}</div>}
                  </div>
                  <span style={{ background: s.bg, color: s.color, fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", padding: "5px 10px" }}>
                    {appt.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Stats + Notes */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Stats */}
          <div style={{ background: "white", padding: "28px", border: "0.5px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "20px" }}>Patient Summary</div>
            {[
              { label: "Total Appointments", val: appointments.length },
              { label: "Completed", val: completed },
              { label: "Upcoming", val: upcoming },
              { label: "Favourite Treatment", val: topTreatment ? treatmentLabels[topTreatment] : "—" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 0", borderBottom: "0.5px solid rgba(0,0,0,0.05)" }}>
                <span style={{ fontSize: "12px", color: "#888" }}>{s.label}</span>
                <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", color: "#D4621A" }}>{s.val}</span>
              </div>
            ))}
          </div>

          {/* Notes */}
          <div style={{ background: "white", padding: "28px", border: "0.5px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "16px" }}>Clinical Notes</div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add private notes about this patient..."
              style={{ width: "100%", height: "140px", padding: "12px", border: "0.5px solid rgba(0,0,0,0.12)", fontFamily: "'Jost',sans-serif", fontSize: "13px", resize: "vertical", outline: "none", color: "#333", lineHeight: 1.6 }}
            />
            <button onClick={saveNotes} disabled={saving} style={{
              marginTop: "12px", width: "100%", background: "#D4621A", color: "#000000", border: "1px solid #A84D12",
              padding: "12px", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
              fontFamily: "'Karla',sans-serif", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
            }}>
              {saving ? "Saving..." : "Save Notes"}
            </button>
          </div>

          {/* Book new */}
          <Link href={`/admin/appointments/new?patient=${id}`} style={{
            display: "block", textAlign: "center", background: "#0F0F0F", color: "white",
            padding: "14px", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
            textDecoration: "none", fontFamily: "'Jost',sans-serif",
          }}>
            + Book New Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
