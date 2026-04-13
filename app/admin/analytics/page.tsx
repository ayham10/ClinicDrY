"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend } from "recharts";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";

const TREATMENTS = ["invisalign", "botox-fillers", "implants-veneers", "general-dentistry"];
const TREATMENT_LABELS: Record<string, string> = {
  "invisalign": "Invisalign", "botox-fillers": "Botox & Fillers",
  "implants-veneers": "Implants & Veneers", "general-dentistry": "General Dentistry",
};
const TREATMENT_COLORS = ["#D4621A", "#3B82F6", "#10B981", "#8B5CF6"];
const STATUS_COLORS: Record<string, string> = {
  confirmed: "#10B981", pending: "#F59E0B", completed: "#6B7280", cancelled: "#EF4444", no_show: "#8B5CF6"
};

export default function AnalyticsPage() {
  const [monthlyData, setMonthlyData] = useState<any[]>([]);
  const [treatmentData, setTreatmentData] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [sourceData, setSourceData] = useState<any[]>([]);
  const [totals, setTotals] = useState({ thisMonth: 0, lastMonth: 0, thisYear: 0, totalPatients: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchAnalytics(); }, []);

  async function fetchAnalytics() {
    const now = new Date();
    const yearStart = `${now.getFullYear()}-01-01`;

    const [{ data: allAppts }, { data: patients }] = await Promise.all([
      supabase.from("appointments").select("*").gte("date", yearStart),
      supabase.from("patients").select("id, source, created_at"),
    ]);

    const appts = allAppts || [];

    // Monthly breakdown (last 12 months)
    const monthly = Array.from({ length: 12 }, (_, i) => {
      const d = subMonths(now, 11 - i);
      const start = format(startOfMonth(d), "yyyy-MM-dd");
      const end = format(endOfMonth(d), "yyyy-MM-dd");
      const count = appts.filter(a => a.date >= start && a.date <= end).length;
      const completed = appts.filter(a => a.date >= start && a.date <= end && a.status === "completed").length;
      return { month: format(d, "MMM"), total: count, completed };
    });
    setMonthlyData(monthly);

    // Treatment breakdown
    const treatmentCounts = TREATMENTS.map((t, i) => ({
      name: TREATMENT_LABELS[t],
      value: appts.filter(a => a.treatment === t).length,
      color: TREATMENT_COLORS[i],
    })).filter(t => t.value > 0);
    setTreatmentData(treatmentCounts);

    // Status breakdown
    const statuses = ["confirmed", "pending", "completed", "cancelled", "no_show"];
    const statusCounts = statuses.map(s => ({
      name: s.replace("_", " "),
      value: appts.filter(a => a.status === s).length,
      color: STATUS_COLORS[s],
    })).filter(s => s.value > 0);
    setStatusData(statusCounts);

    // Source breakdown
    const sources = ["website", "instagram", "whatsapp", "walkin", "referral"];
    const srcColors: Record<string, string> = { instagram: "#E1306C", website: "#3B82F6", whatsapp: "#25D366", walkin: "#F59E0B", referral: "#8B5CF6" };
    const sourceCounts = sources.map(s => ({
      name: s, value: (patients || []).filter(p => p.source === s).length, color: srcColors[s],
    })).filter(s => s.value > 0);
    setSourceData(sourceCounts);

    // Totals
    const thisMonthStart = format(startOfMonth(now), "yyyy-MM-dd");
    const thisMonthEnd = format(endOfMonth(now), "yyyy-MM-dd");
    const lastMonthStart = format(startOfMonth(subMonths(now, 1)), "yyyy-MM-dd");
    const lastMonthEnd = format(endOfMonth(subMonths(now, 1)), "yyyy-MM-dd");

    setTotals({
      thisMonth: appts.filter(a => a.date >= thisMonthStart && a.date <= thisMonthEnd).length,
      lastMonth: appts.filter(a => a.date >= lastMonthStart && a.date <= lastMonthEnd).length,
      thisYear: appts.length,
      totalPatients: (patients || []).length,
    });

    setLoading(false);
  }

  const growth = totals.lastMonth > 0 ? Math.round(((totals.thisMonth - totals.lastMonth) / totals.lastMonth) * 100) : 0;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.1)", padding: "12px 16px", fontFamily: "'Jost',sans-serif", fontSize: "12px" }}>
          <div style={{ fontWeight: 500, marginBottom: "4px" }}>{label}</div>
          {payload.map((p: any) => (
            <div key={p.name} style={{ color: p.color }}>{p.name}: {p.value}</div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ padding: "40px 48px", minHeight: "100vh", background: "#F5F3EF" }}>
      <div style={{ marginBottom: "40px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "8px" }}>Business Intelligence</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", fontWeight: 300, color: "#0F0F0F" }}>
          Clinic <em style={{ fontStyle: "italic", color: "#D4621A" }}>Analytics</em>
        </h1>
      </div>

      {/* KPI Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "This Month", value: totals.thisMonth, sub: growth > 0 ? `↑ ${growth}% vs last month` : growth < 0 ? `↓ ${Math.abs(growth)}% vs last month` : "Same as last month", subColor: growth > 0 ? "#10B981" : growth < 0 ? "#EF4444" : "#888" },
          { label: "Last Month", value: totals.lastMonth, sub: format(subMonths(new Date(), 1), "MMMM yyyy"), subColor: "#888" },
          { label: "This Year", value: totals.thisYear, sub: `Jan – ${format(new Date(), "MMM")} ${new Date().getFullYear()}`, subColor: "#888" },
          { label: "Total Patients", value: totals.totalPatients, sub: "All time", subColor: "#888" },
        ].map(card => (
          <div key={card.label} style={{ background: "white", padding: "28px 24px", border: "0.5px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#888", marginBottom: "12px" }}>{card.label}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "48px", fontWeight: 300, color: "#D4621A", lineHeight: 1 }}>
              {loading ? "—" : card.value}
            </div>
            <div style={{ fontSize: "11px", color: card.subColor, marginTop: "8px" }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Monthly chart */}
      <div style={{ background: "white", padding: "32px", border: "0.5px solid rgba(0,0,0,0.06)", marginBottom: "24px" }}>
        <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "8px" }}>Monthly Overview</div>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 300, color: "#0F0F0F", marginBottom: "28px" }}>
          Appointments This Year
        </div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={monthlyData} barGap={4}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
            <XAxis dataKey="month" tick={{ fontFamily: "'Jost',sans-serif", fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontFamily: "'Jost',sans-serif", fontSize: 11, fill: "#888" }} axisLine={false} tickLine={false} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontFamily: "'Jost',sans-serif", fontSize: "11px" }} />
            <Bar dataKey="total" fill="#D4621A" name="Total" radius={[2, 2, 0, 0]} opacity={0.9} />
            <Bar dataKey="completed" fill="#10B981" name="Completed" radius={[2, 2, 0, 0]} opacity={0.8} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bottom row: pie charts */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Treatment breakdown */}
        <div style={{ background: "white", padding: "32px", border: "0.5px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "8px" }}>Treatment Breakdown</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 300, color: "#0F0F0F", marginBottom: "24px" }}>Most Popular Services</div>
          {treatmentData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#ccc" }}>No data yet</div>
          ) : (
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={treatmentData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                    {treatmentData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip formatter={(val: any, name: any) => [val, name]} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                {treatmentData.map(t => (
                  <div key={t.name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: t.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: "12px", color: "#555" }}>{t.name}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", color: t.color }}>{t.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Patient sources */}
        <div style={{ background: "white", padding: "32px", border: "0.5px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "8px" }}>Patient Sources</div>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontWeight: 300, color: "#0F0F0F", marginBottom: "24px" }}>Where Patients Come From</div>
          {sourceData.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#ccc" }}>No data yet</div>
          ) : (
            <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
              <ResponsiveContainer width={160} height={160}>
                <PieChart>
                  <Pie data={sourceData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" strokeWidth={0}>
                    {sourceData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "12px" }}>
                {sourceData.map(s => (
                  <div key={s.name} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: s.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, fontSize: "12px", color: "#555", textTransform: "capitalize" }}>{s.name}</div>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", color: s.color }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
