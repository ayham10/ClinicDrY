"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

export default function PatientsPage() {
  const [patients, setPatients] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchPatients(); }, []);

  async function fetchPatients() {
    const { data } = await supabase
      .from("patients")
      .select("*, appointments(id, status, date, treatment)")
      .order("created_at", { ascending: false });
    setPatients(data || []);
    setLoading(false);
  }

  const filtered = patients.filter(p =>
    p.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.phone?.includes(search) ||
    p.email?.toLowerCase().includes(search.toLowerCase())
  );

  const sourceColor: Record<string, string> = {
    instagram: "#E1306C", website: "#3B82F6", whatsapp: "#25D366",
    walkin: "#F59E0B", referral: "#8B5CF6",
  };

  return (
    <div style={{ padding: "40px 48px", minHeight: "100vh", background: "#F5F3EF" }}>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "8px" }}>Records</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", fontWeight: 300, color: "#0F0F0F" }}>
            Patient <em style={{ fontStyle: "italic", color: "#D4621A" }}>Directory</em>
          </h1>
        </div>
        <div style={{ fontSize: "13px", color: "#888", marginTop: "24px" }}>{filtered.length} patients total</div>
      </div>

      {/* Search */}
      <div style={{ background: "white", padding: "16px 20px", border: "0.5px solid rgba(0,0,0,0.06)", marginBottom: "16px" }}>
        <input
          placeholder="Search by name, phone, or email..."
          value={search} onChange={e => setSearch(e.target.value)}
          style={{ width: "100%", border: "none", outline: "none", fontFamily: "'Jost',sans-serif", fontSize: "14px", color: "#1a1a1a", background: "transparent" }}
        />
      </div>

      {/* Grid */}
      {loading ? (
        <div style={{ padding: "60px", textAlign: "center", color: "#aaa", fontFamily: "'Cormorant Garamond',serif", fontSize: "20px" }}>Loading patients...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "16px" }}>
          {filtered.map(p => {
            const total = p.appointments?.length || 0;
            const completed = p.appointments?.filter((a: any) => a.status === "completed").length || 0;
            const upcoming = p.appointments?.filter((a: any) => ["pending", "confirmed"].includes(a.status) && new Date(a.date) >= new Date()).length || 0;

            return (
              <Link key={p.id} href={`/admin/patients/${p.id}`} style={{ textDecoration: "none" }}>
                <div style={{ background: "white", padding: "28px", border: "0.5px solid rgba(0,0,0,0.06)", transition: "all 0.2s", cursor: "pointer" }}>
                  {/* Avatar + name */}
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px" }}>
                    <div style={{
                      width: "44px", height: "44px", borderRadius: "50%",
                      background: "#D4621A", display: "flex", alignItems: "center", justifyContent: "center",
                      fontFamily: "'Cormorant Garamond',serif", fontSize: "18px", color: "#000000", fontWeight: 400, flexShrink: 0, border: "1px solid #A84D12",
                    }}>
                      {p.full_name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, fontSize: "15px", color: "#0F0F0F" }}>{p.full_name}</div>
                      <div style={{ fontSize: "12px", color: "#888" }}>{p.phone}</div>
                    </div>
                  </div>

                  {/* Stats row */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "16px" }}>
                    {[{ label: "Total", val: total }, { label: "Done", val: completed }, { label: "Upcoming", val: upcoming }].map(s => (
                      <div key={s.label} style={{ textAlign: "center", padding: "10px 0", background: "#FAFAF8", border: "0.5px solid rgba(0,0,0,0.05)" }}>
                        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", color: "#D4621A" }}>{s.val}</div>
                        <div style={{ fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#aaa" }}>{s.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Source + date */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{
                      fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase",
                      color: sourceColor[p.source] || "#888",
                      background: `${sourceColor[p.source] || "#888"}15`,
                      padding: "4px 10px",
                    }}>
                      {p.source || "unknown"}
                    </span>
                    <span style={{ fontSize: "10px", color: "#ccc" }}>
                      Since {p.created_at ? format(new Date(p.created_at), "MMM yyyy") : "—"}
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
