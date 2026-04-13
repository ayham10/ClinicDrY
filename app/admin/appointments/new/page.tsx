"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function NewAppointmentPage() {
  const router = useRouter();
  const [patients, setPatients] = useState<any[]>([]);
  const [mode, setMode] = useState<"existing" | "new">("existing");
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    patient_id: "", treatment: "", date: "", time: "", notes: "", status: "confirmed",
    new_name: "", new_phone: "", new_email: "", new_source: "walkin",
  });

  useEffect(() => {
    supabase.from("patients").select("id, full_name, phone").order("full_name").then(({ data }) => setPatients(data || []));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    let patientId = form.patient_id;

    if (mode === "new") {
      const { data: newPatient, error } = await supabase.from("patients").insert({
        full_name: form.new_name, phone: form.new_phone,
        email: form.new_email || null, source: form.new_source,
      }).select().single();
      if (error || !newPatient) { setSaving(false); alert("Error creating patient: " + error?.message); return; }
      patientId = newPatient.id;
    }

    const { error } = await supabase.from("appointments").insert({
      patient_id: patientId, treatment: form.treatment,
      date: form.date, time: form.time,
      notes: form.notes || null, status: form.status,
    });

    if (error) { alert("Error: " + error.message); setSaving(false); return; }
    router.push("/admin/appointments");
  };

  const inp = { width: "100%", padding: "12px 16px", border: "0.5px solid rgba(0,0,0,0.15)", background: "white", fontFamily: "'Jost',sans-serif", fontSize: "13px", outline: "none" } as React.CSSProperties;
  const label = { fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase" as const, color: "#888", display: "block", marginBottom: "8px" };

  return (
    <div style={{ padding: "40px 48px", minHeight: "100vh", background: "#F5F3EF" }}>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "8px" }}>Appointments</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", fontWeight: 300, color: "#0F0F0F" }}>
          New <em style={{ fontStyle: "italic", color: "#D4621A" }}>Appointment</em>
        </h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "32px", maxWidth: "960px" }}>
        {/* Left: Patient */}
        <div style={{ background: "white", padding: "36px", border: "0.5px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "24px" }}>Patient</div>

          {/* Mode toggle */}
          <div style={{ display: "flex", marginBottom: "24px", border: "0.5px solid rgba(0,0,0,0.1)" }}>
            {(["existing", "new"] as const).map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                flex: 1, padding: "10px", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase",
                background: mode === m ? "#0F0F0F" : "white", color: mode === m ? "white" : "#888",
                border: "none", cursor: "pointer", fontFamily: "'Jost',sans-serif",
              }}>
                {m === "existing" ? "Existing Patient" : "New Patient"}
              </button>
            ))}
          </div>

          {mode === "existing" ? (
            <div>
              <label style={label}>Select Patient</label>
              <select value={form.patient_id} onChange={e => setForm({ ...form, patient_id: e.target.value })} style={inp}>
                <option value="">— Choose patient —</option>
                {patients.map(p => <option key={p.id} value={p.id}>{p.full_name} · {p.phone}</option>)}
              </select>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div><label style={label}>Full Name *</label><input style={inp} value={form.new_name} onChange={e => setForm({ ...form, new_name: e.target.value })} placeholder="Patient full name" /></div>
              <div><label style={label}>Phone *</label><input style={inp} value={form.new_phone} onChange={e => setForm({ ...form, new_phone: e.target.value })} placeholder="+972 50..." /></div>
              <div><label style={label}>Email</label><input style={inp} value={form.new_email} onChange={e => setForm({ ...form, new_email: e.target.value })} placeholder="optional" /></div>
              <div>
                <label style={label}>Source</label>
                <select value={form.new_source} onChange={e => setForm({ ...form, new_source: e.target.value })} style={inp}>
                  <option value="walkin">Walk-in</option>
                  <option value="instagram">Instagram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="website">Website</option>
                  <option value="referral">Referral</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Right: Appointment details */}
        <div style={{ background: "white", padding: "36px", border: "0.5px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "24px" }}>Appointment Details</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            <div>
              <label style={label}>Treatment *</label>
              <select value={form.treatment} onChange={e => setForm({ ...form, treatment: e.target.value })} style={inp}>
                <option value="">— Select treatment —</option>
                <option value="invisalign">Invisalign</option>
                <option value="botox-fillers">Botox & Fillers</option>
                <option value="implants-veneers">Implants & Veneers</option>
                <option value="general-dentistry">General Dentistry</option>
              </select>
            </div>
            <div>
              <label style={label}>Date *</label>
              <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={label}>Time *</label>
              <input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} style={inp} />
            </div>
            <div>
              <label style={label}>Status</label>
              <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })} style={inp}>
                <option value="confirmed">Confirmed</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <div>
              <label style={label}>Notes</label>
              <textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Any notes about this appointment..." style={{ ...inp, height: "80px", resize: "vertical" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div style={{ display: "flex", gap: "16px", marginTop: "24px", maxWidth: "960px" }}>
        <button onClick={handleSave} disabled={saving} style={{
          background: "#D4621A", color: "#000000", border: "1px solid #A84D12", padding: "14px 40px", borderRadius: 0,
          fontSize: "12px", letterSpacing: "0.5px", textTransform: "none",
          fontFamily: "'Karla',sans-serif", fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
        }}>
          {saving ? "Saving..." : "Save Appointment"}
        </button>
        <button onClick={() => router.back()} style={{
          background: "white", color: "#555", border: "0.5px solid rgba(0,0,0,0.15)",
          padding: "16px 32px", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase",
          fontFamily: "'Jost',sans-serif", cursor: "pointer",
        }}>
          Cancel
        </button>
      </div>
    </div>
  );
}
