"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameDay, addMonths, subMonths, isToday } from "date-fns";

const treatmentLabels: Record<string, string> = {
  "invisalign": "Invisalign", "botox-fillers": "Botox & Fillers",
  "implants-veneers": "Implants & Veneers", "general-dentistry": "General Dentistry",
};
const statusColors: Record<string, string> = {
  pending: "#F59E0B", confirmed: "#10B981", cancelled: "#EF4444",
  completed: "#6B7280", no_show: "#8B5CF6",
};

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchMonth(); }, [currentMonth]);

  async function fetchMonth() {
    setLoading(true);
    const start = format(startOfMonth(currentMonth), "yyyy-MM-dd");
    const end = format(endOfMonth(currentMonth), "yyyy-MM-dd");
    const { data } = await supabase
      .from("appointments")
      .select("*, patient:patients(full_name, phone)")
      .gte("date", start).lte("date", end)
      .order("time");
    setAppointments(data || []);
    setLoading(false);
  }

  const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
  const firstDayOfWeek = getDay(startOfMonth(currentMonth));
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getAppts = (day: Date) => appointments.filter(a => a.date === format(day, "yyyy-MM-dd"));
  const selectedAppts = selectedDay ? getAppts(selectedDay) : [];

  return (
    <div style={{ padding: "40px 48px", minHeight: "100vh", background: "#F5F3EF" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "32px" }}>
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "8px" }}>Schedule</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "36px", fontWeight: 300, color: "#0F0F0F" }}>
            Appointment <em style={{ fontStyle: "italic", color: "#D4621A" }}>Calendar</em>
          </h1>
        </div>
        {/* Month navigation */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.12)", width: "36px", height: "36px", cursor: "pointer", fontSize: "16px" }}>‹</button>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "24px", fontWeight: 300, minWidth: "180px", textAlign: "center" }}>
            {format(currentMonth, "MMMM yyyy")}
          </div>
          <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.12)", width: "36px", height: "36px", cursor: "pointer", fontSize: "16px" }}>›</button>
          <button onClick={() => { setCurrentMonth(new Date()); setSelectedDay(new Date()); }} style={{ background: "#D4621A", color: "#000000", border: "1px solid #A84D12", padding: "8px 20px", cursor: "pointer", fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", fontFamily: "'Karla',sans-serif", fontWeight: 600 }}>Today</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: "24px" }}>
        {/* Calendar grid */}
        <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.06)" }}>
          {/* Day names */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
            {dayNames.map(d => (
              <div key={d} style={{ padding: "12px 8px", textAlign: "center", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", color: "#aaa" }}>{d}</div>
            ))}
          </div>
          {/* Days */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)" }}>
            {/* Empty cells before first day */}
            {Array.from({ length: firstDayOfWeek }).map((_, i) => (
              <div key={`empty-${i}`} style={{ minHeight: "90px", borderRight: "0.5px solid rgba(0,0,0,0.04)", borderBottom: "0.5px solid rgba(0,0,0,0.04)", background: "#FAFAF8" }} />
            ))}
            {days.map(day => {
              const dayAppts = getAppts(day);
              const isSelected = selectedDay && isSameDay(day, selectedDay);
              const today = isToday(day);
              return (
                <div
                  key={day.toISOString()}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    minHeight: "90px", padding: "8px", cursor: "pointer",
                    borderRight: "0.5px solid rgba(0,0,0,0.04)",
                    borderBottom: "0.5px solid rgba(0,0,0,0.04)",
                    background: isSelected ? "rgba(212,98,26,0.06)" : "white",
                    transition: "background 0.15s",
                  }}
                >
                  <div style={{
                    width: "26px", height: "26px", borderRadius: "50%",
                    background: today ? "#D4621A" : "transparent",
                    color: today ? "#000000" : isSelected ? "#D4621A" : "#333",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "12px", fontWeight: today ? 500 : 400, marginBottom: "4px",
                  }}>
                    {format(day, "d")}
                  </div>
                  {dayAppts.slice(0, 3).map(a => (
                    <div key={a.id} style={{
                      fontSize: "9px", padding: "2px 5px", marginBottom: "2px",
                      background: `${statusColors[a.status]}20`,
                      color: statusColors[a.status],
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>
                      {a.time?.slice(0, 5)} {a.patient?.full_name?.split(" ")[0]}
                    </div>
                  ))}
                  {dayAppts.length > 3 && (
                    <div style={{ fontSize: "9px", color: "#aaa" }}>+{dayAppts.length - 3} more</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Day detail panel */}
        <div style={{ background: "white", border: "0.5px solid rgba(0,0,0,0.06)" }}>
          <div style={{ padding: "20px 24px", borderBottom: "0.5px solid rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#D4621A", marginBottom: "4px" }}>
              {selectedDay ? format(selectedDay, "EEEE") : "Select a day"}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "28px", fontWeight: 300, color: "#0F0F0F" }}>
              {selectedDay ? format(selectedDay, "MMMM d, yyyy") : "—"}
            </div>
            <div style={{ fontSize: "12px", color: "#888", marginTop: "4px" }}>
              {selectedAppts.length} appointment{selectedAppts.length !== 1 ? "s" : ""}
            </div>
          </div>

          <div style={{ padding: "16px 0" }}>
            {selectedAppts.length === 0 ? (
              <div style={{ padding: "40px 24px", textAlign: "center", color: "#ccc", fontFamily: "'Cormorant Garamond',serif", fontSize: "18px" }}>
                No appointments this day
              </div>
            ) : selectedAppts.map((a, i) => (
              <div key={a.id} style={{ padding: "16px 24px", borderBottom: i < selectedAppts.length - 1 ? "0.5px solid rgba(0,0,0,0.05)" : "none" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ width: "3px", alignSelf: "stretch", background: statusColors[a.status], flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "20px", color: "#D4621A", lineHeight: 1, marginBottom: "4px" }}>
                      {a.time?.slice(0, 5)}
                    </div>
                    <div style={{ fontWeight: 500, fontSize: "13px", color: "#0F0F0F", marginBottom: "2px" }}>{a.patient?.full_name}</div>
                    <div style={{ fontSize: "11px", color: "#888", marginBottom: "4px" }}>{treatmentLabels[a.treatment]}</div>
                    <span style={{ fontSize: "9px", letterSpacing: "1px", textTransform: "uppercase", color: statusColors[a.status], background: `${statusColors[a.status]}15`, padding: "3px 8px" }}>
                      {a.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: "24px", marginTop: "16px", flexWrap: "wrap" }}>
        {Object.entries(statusColors).map(([status, color]) => (
          <div key={status} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: color }} />
            <span style={{ fontSize: "10px", letterSpacing: "1px", textTransform: "uppercase", color: "#888" }}>{status.replace("_", " ")}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
