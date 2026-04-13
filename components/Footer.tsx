"use client";
import Link from "next/link";
import { translations, Lang } from "@/lib/i18n";

interface FooterProps { lang: Lang; }

export default function Footer({ lang }: FooterProps) {
  const t = translations[lang].footer;
  const nav = translations[lang].nav;
  const dir = translations[lang].dir;

  return (
    <footer dir={dir} style={{ background: "#0F0F0F" }}>
      {/* Main footer */}
      <div style={{
        padding: "72px 48px 48px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr 1fr",
        gap: "60px",
        borderBottom: "0.5px solid rgba(255,255,255,0.08)",
      }}>
        {/* Brand */}
        <div>
          <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "28px", fontWeight: 300, color: "white", marginBottom: "8px" }}>
            Dr. <span style={{ color: "#D4621A" }}>Yara Salem</span>
          </div>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#555", marginBottom: "20px" }}>
            {t.tagline}
          </div>
          <p style={{ fontSize: "13px", color: "#666", lineHeight: 1.8, maxWidth: "280px" }}>
            {t.location}
          </p>
          <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
            {/* WhatsApp */}
            <a href={`https://wa.me/972547997273`} target="_blank" rel="noreferrer"
              style={{ width: "36px", height: "36px", border: "0.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#D4621A">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://instagram.com/dr.yarasalem_clinic" target="_blank" rel="noreferrer"
              style={{ width: "36px", height: "36px", border: "0.5px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D4621A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                <circle cx="12" cy="12" r="4"/>
                <circle cx="17.5" cy="6.5" r="0.5" fill="#D4621A"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Links */}
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "24px" }}>Navigation</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            {[
              { label: nav.home, href: "/" },
              { label: nav.about, href: "/about" },
              { label: nav.treatments, href: "/treatments" },
              { label: nav.booking, href: "/booking" },
            ].map((item) => (
              <Link key={item.href} href={item.href} style={{ fontSize: "12px", color: "#666", textDecoration: "none", letterSpacing: "1px", transition: "color 0.2s" }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "24px" }}>Contact</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <span style={{ fontSize: "12px", color: "#666", letterSpacing: "0.5px" }}>{nav.phone}</span>
            <span style={{ fontSize: "12px", color: "#666", letterSpacing: "0.5px" }}>{nav.location}</span>
            <Link href="/booking" style={{
              fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
              background: "#D4621A", color: "#ffffff", padding: "12px 22px",
              textDecoration: "none", fontFamily: "'Jost', sans-serif",
              fontWeight: 500, display: "inline-block", marginTop: "8px",
            }}>
              {nav.booking}
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{ padding: "20px 48px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "10px", color: "#444", letterSpacing: "1px" }}>{t.rights}</span>
        <span style={{ fontSize: "10px", color: "#333", letterSpacing: "1px" }}>@dr.yarasalem_clinic</span>
      </div>
    </footer>
  );
}
