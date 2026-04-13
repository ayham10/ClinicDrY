"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { translations, Lang } from "@/lib/i18n";

interface NavbarProps {
  lang: Lang;
  onLangChange: (lang: Lang) => void;
  /** When true: clear bar + light text over hero until user scrolls (Jackson-style). */
  transparentWhenTop?: boolean;
}

export default function Navbar({ lang, onLangChange, transparentWhenTop = false }: NavbarProps) {
  const t = translations[lang].nav;
  const dir = translations[lang].dir;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const handler = () => { if (window.innerWidth > 768) setMenuOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  const solid = !transparentWhenTop || scrolled;
  const orange = "#D4621A";

  const navStyle: React.CSSProperties = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 1000,
    height: "72px", display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "0 32px",
    background: solid ? "rgba(242,236,226,0.97)" : "transparent",
    borderBottom: solid ? "0.5px solid rgba(212,98,26,0.12)" : "1px solid transparent",
    backdropFilter: solid ? "blur(16px)" : "none",
    boxShadow: solid ? "0 2px 32px rgba(0,0,0,0.05)" : "none",
    transition: "background 0.35s ease, border-color 0.35s ease, box-shadow 0.35s ease",
  };

  const textMain = solid ? "#0F0F0F" : "rgba(255,255,255,0.95)";
  const textMuted = solid ? "#888" : "rgba(255,255,255,0.6)";
  const burger = solid ? (menuOpen ? orange : "#0F0F0F") : (menuOpen ? orange : "#ffffff");

  return (
    <>
      <style>{`
        .nav-links { display: flex; gap: 32px; align-items: center; }
        .nav-right-desktop { display: flex; align-items: center; gap: 16px; }
        .hamburger { display: none; background: none; border: none; cursor: pointer; flex-direction: column; gap: 5px; padding: 4px; }
        @media (max-width: 768px) {
          .nav-links { display: none; }
          .nav-right-desktop { display: none; }
          .hamburger { display: flex; }
        }
        .nav-link-dynamic {
          position: relative;
          font-size: 11px;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          transition: color 0.2s;
        }
        .nav-link-dynamic::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 0;
          height: 1px;
          background: ${orange};
          transition: width 0.3s ease;
        }
        .nav-link-dynamic:hover { color: ${orange} !important; }
        .nav-link-dynamic:hover::after { width: 100%; }
        .mobile-menu {
          position: fixed; top: 72px; left: 0; right: 0; bottom: 0; z-index: 999;
          background: rgba(15,15,15,0.97); display: flex; flex-direction: column;
          padding: 40px 32px; gap: 0; overflow-y: auto;
          transform: translateX(-100%); transition: transform 0.3s ease;
        }
        .mobile-menu.open { transform: translateX(0); }
        .mobile-nav-link {
          font-size: 13px; letter-spacing: 2.5px; text-transform: uppercase;
          color: #aaa; text-decoration: none; padding: 20px 0;
          border-bottom: 0.5px solid rgba(255,255,255,0.06);
          font-family: 'Jost', sans-serif; transition: color 0.2s;
        }
        .mobile-nav-link:hover { color: ${orange}; }
        .mobile-nav-link.orange { color: ${orange}; }
      `}</style>

      <nav dir={dir} style={navStyle}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
          <div style={{ position: "relative", width: "40px", height: "40px", borderRadius: "50%", overflow: "hidden", border: `1.5px solid ${solid ? "rgba(212,98,26,0.35)" : "rgba(255,255,255,0.45)"}` }}>
            <Image src="/images/logo-brand.png" alt="Dr. Yara Salem" fill style={{ objectFit: "cover" }} />
          </div>
          <div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "16px", fontWeight: 400, letterSpacing: "1px", color: textMain, lineHeight: 1 }}>
              Dr. <span style={{ color: orange }}>Yara Salem</span>
            </div>
            <div style={{ fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase", color: textMuted, marginTop: "2px" }}>
              Dental & Facial Aesthetics
            </div>
          </div>
        </Link>

        <div className="nav-links">
          <Link href="/" className="nav-link-dynamic" style={{ color: solid ? "#444" : "rgba(255,255,255,0.92)" }}>{t.home}</Link>
          <Link href="/about" className="nav-link-dynamic" style={{ color: solid ? "#444" : "rgba(255,255,255,0.92)" }}>{t.about}</Link>
          <Link href="/treatments" className="nav-link-dynamic" style={{ color: solid ? "#444" : "rgba(255,255,255,0.92)" }}>{t.treatments}</Link>
        </div>

        <div className="nav-right-desktop">
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
              <path d="M13 10.5c-1 0-2-.2-2.9-.5-.3-.1-.6 0-.8.2l-1.8 1.8C5.9 10.7 5.3 10 3.9 8.5l1.8-1.8c.2-.2.3-.5.2-.8-.3-.9-.5-1.9-.5-2.9 0-.4-.4-.8-.8-.8H2c-.4 0-.8.4-.8.8C1.2 10 6 14.8 13 14.8c.4 0 .8-.4.8-.8v-2.7c0-.4-.4-.8-.8-.8z" fill={orange}/>
            </svg>
            <span style={{ fontSize: "11px", color: solid ? "#555" : "rgba(255,255,255,0.88)" }}>{t.phone}</span>
          </div>
          <button onClick={() => onLangChange(lang === "en" ? "ar" : "en")} style={{ fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase", background: "transparent", border: `1px solid ${solid ? "rgba(212,98,26,0.45)" : "rgba(255,255,255,0.45)"}`, color: solid ? orange : "#ffffff", padding: "6px 14px", cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>
            {lang === "en" ? "ع" : "EN"}
          </button>
          <Link href="/booking" style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", background: orange, color: "white", padding: "10px 20px", textDecoration: "none", fontFamily: "'Jost',sans-serif", fontWeight: 500 }}>
            {t.booking}
          </Link>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span style={{ display: "block", width: "22px", height: "1.5px", background: burger, transition: "all 0.3s", transform: menuOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
          <span style={{ display: "block", width: "16px", height: "1.5px", background: orange, opacity: menuOpen ? 0 : 1, transition: "opacity 0.2s" }} />
          <span style={{ display: "block", width: "22px", height: "1.5px", background: burger, transition: "all 0.3s", transform: menuOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
        </button>
      </nav>

      <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "14px", fontWeight: 300, color: "white", marginBottom: "32px" }}>
          Dr. <em style={{ fontStyle: "italic", color: orange }}>Yara Salem</em>
        </div>
        {[
          { href: "/", label: t.home },
          { href: "/about", label: t.about },
          { href: "/treatments", label: t.treatments },
        ].map(item => (
          <Link key={item.href} href={item.href} className="mobile-nav-link" onClick={() => setMenuOpen(false)}>
            {item.label}
          </Link>
        ))}
        <Link href="/booking" className="mobile-nav-link orange" onClick={() => setMenuOpen(false)} style={{ marginTop: "8px" }}>
          {t.booking}
        </Link>
        <div style={{ marginTop: "40px", display: "flex", gap: "16px", alignItems: "center" }}>
          <button onClick={() => { onLangChange(lang === "en" ? "ar" : "en"); setMenuOpen(false); }} style={{ fontSize: "12px", letterSpacing: "1.5px", textTransform: "uppercase", background: "transparent", border: "1px solid rgba(212,98,26,0.45)", color: orange, padding: "10px 20px", cursor: "pointer", fontFamily: "'Jost',sans-serif" }}>
            {lang === "en" ? "العربية" : "English"}
          </button>
          <a href={`tel:${t.phone.replace(/[^\d+]/g, "")}`} style={{ fontSize: "13px", color: "#ccc", textDecoration: "none" }}>{t.phone}</a>
        </div>
      </div>
    </>
  );
}
