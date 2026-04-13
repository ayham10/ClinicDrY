"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError("Invalid email or password. Please try again.");
      setLoading(false);
    } else {
      router.push("/admin");
    }
  };

  const inp = {
    width: "100%", padding: "14px 16px",
    border: "0.5px solid rgba(255,255,255,0.12)",
    background: "rgba(255,255,255,0.04)",
    color: "white", fontFamily: "'Jost',sans-serif", fontSize: "13px",
    outline: "none", marginBottom: "16px",
  } as React.CSSProperties;

  return (
    <div style={{
      minHeight: "100vh", background: "#0F0F0F",
      display: "flex", alignItems: "center", justifyContent: "center",
      position: "relative", overflow: "hidden",
    }}>
      {/* Background glow */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,98,26,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ width: "100%", maxWidth: "400px", padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "32px", fontWeight: 300, color: "white" }}>
            Dr. <em style={{ fontStyle: "italic", color: "#D4621A" }}>Yara Salem</em>
          </div>
          <div style={{ fontSize: "9px", letterSpacing: "3.5px", textTransform: "uppercase", color: "#555", marginTop: "8px" }}>
            Staff Portal
          </div>
          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "24px" }}>
            <div style={{ flex: 1, height: "0.5px", background: "linear-gradient(to right, transparent, rgba(212,98,26,0.4))" }} />
            <div style={{ width: "5px", height: "5px", background: "#D4621A", transform: "rotate(45deg)" }} />
            <div style={{ flex: 1, height: "0.5px", background: "linear-gradient(to left, transparent, rgba(212,98,26,0.4))" }} />
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin}>
          <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#666", display: "block", marginBottom: "8px" }}>
            Email
          </label>
          <input style={inp} type="email" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />

          <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#666", display: "block", marginBottom: "8px" }}>
            Password
          </label>
          <input style={inp} type="password" value={password} onChange={e => setPassword(e.target.value)} required />

          {error && (
            <div style={{ background: "rgba(239,68,68,0.1)", border: "0.5px solid rgba(239,68,68,0.3)", padding: "12px 16px", marginBottom: "20px", fontSize: "12px", color: "#EF4444" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={loading} style={{
            width: "100%", background: loading ? "#A84D12" : "#D4621A",
            color: "#000000", border: loading ? "1px solid #8B3D0F" : "1px solid #A84D12", padding: "16px", borderRadius: 0,
            fontSize: "12px", letterSpacing: "0.5px", textTransform: "none",
            fontFamily: "'Karla',sans-serif", fontWeight: 600, cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
          }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "32px", fontSize: "11px", color: "#333" }}>
          ← <a href="/" style={{ color: "#555", textDecoration: "none" }}>Back to website</a>
        </div>
      </div>
    </div>
  );
}
