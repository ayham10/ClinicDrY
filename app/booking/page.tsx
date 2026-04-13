"use client";
import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lang } from "@/lib/i18n";

export default function BookingPage() {
  const [lang, setLang] = useState<Lang>("en");
  const [form, setForm] = useState({ name: "", phone: "", service: "", date: "", message: "" });
  const [sent, setSent] = useState(false);
  const dir = lang === "ar" ? "rtl" : "ltr";

  const c = {
    en: {
      eyebrow: "Private Consultation",
      title: "Book an",
      italic: "Appointment",
      sub: "Fill in the form below and we'll reach out to confirm your appointment within 24 hours.",
      name: "Full Name",
      phone: "Phone Number",
      service: "Select Treatment",
      date: "Preferred Date",
      message: "Message (Optional)",
      services: ["Invisalign", "Botox & Fillers", "Implants & Veneers", "General Dentistry", "Other / Not Sure"],
      btn: "Send via WhatsApp",
      confirm: "Your message has been sent! We'll confirm your appointment shortly.",
      info: "Or call us directly:",
    },
    ar: {
      eyebrow: "استشارة خاصة",
      title: "احجز",
      italic: "موعدك",
      sub: "املأ النموذج أدناه وسنتواصل معك لتأكيد موعدك خلال 24 ساعة.",
      name: "الاسم الكامل",
      phone: "رقم الهاتف",
      service: "اختر العلاج",
      date: "التاريخ المفضل",
      message: "رسالة (اختياري)",
      services: ["الإينفيزالاين", "البوتوكس والفيلر", "الزراعة والقشور", "طب الأسنان العام", "أخرى / غير متأكد"],
      btn: "أرسل عبر واتساب",
      confirm: "تم إرسال رسالتك! سنؤكد موعدك قريبًا.",
      info: "أو اتصل بنا مباشرة:",
    },
  };

  const content = c[lang];

  const inputStyle = {
    width: "100%",
    padding: "14px 16px",
    border: "0.5px solid rgba(0,0,0,0.15)",
    background: "var(--card)",
    fontFamily: "'Jost', sans-serif",
    fontSize: "13px",
    color: "#1a1a1a",
    outline: "none",
    transition: "border-color 0.2s",
    appearance: "none" as const,
  };

  const labelStyle = {
    fontSize: "10px",
    letterSpacing: "2px",
    textTransform: "uppercase" as const,
    color: "#888",
    display: "block",
    marginBottom: "8px",
    fontFamily: "'Jost', sans-serif",
  };

  const handleSubmit = () => {
    const msg = encodeURIComponent(
      `*New Appointment Request*\n\nName: ${form.name}\nPhone: ${form.phone}\nService: ${form.service}\nDate: ${form.date}\nMessage: ${form.message || "—"}`
    );
    window.open(`https://wa.me/972547997273?text=${msg}`, "_blank");
    setSent(true);
  };

  return (
    <div dir={dir} style={{ background: "var(--off-white)" }}>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* Page hero */}
      <div style={{ paddingTop: "72px", background: "#0F0F0F", position: "relative", overflow: "hidden", height: "320px" }}>
        <Image src="/images/clinic-roses.png" alt="Book" fill style={{ objectFit: "cover", opacity: 0.25 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212,98,26,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#D4621A", marginBottom: "16px" }}>{content.eyebrow}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px,6vw,60px)", fontWeight: 300, color: "white" }}>
            {content.title} <em style={{ fontStyle: "italic", color: "#D4621A" }}>{content.italic}</em>
          </h1>
        </div>
      </div>

      {/* Form section */}
      <section style={{ padding: "80px 48px", display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "80px", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Form */}
        <div>
          <p style={{ fontSize: "13px", color: "#888", lineHeight: 1.8, marginBottom: "48px" }}>{content.sub}</p>

          {sent ? (
            <div style={{ padding: "40px", background: "var(--card)", border: "1px solid rgba(212,98,26,0.3)", textAlign: "center" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>✓</div>
              <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "20px", color: "#D4621A" }}>{content.confirm}</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={labelStyle}>{content.name}</label>
                  <input style={inputStyle} type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                <div>
                  <label style={labelStyle}>{content.phone}</label>
                  <input style={inputStyle} type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={labelStyle}>{content.service}</label>
                  <select style={{ ...inputStyle, cursor: "pointer" }} value={form.service} onChange={e => setForm({ ...form, service: e.target.value })}>
                    <option value="">—</option>
                    {content.services.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>{content.date}</label>
                  <input style={inputStyle} type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                </div>
              </div>

              <div>
                <label style={labelStyle}>{content.message}</label>
                <textarea style={{ ...inputStyle, height: "120px", resize: "vertical" }} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
              </div>

              <button
                onClick={handleSubmit}
                style={{ background: "#D4621A", color: "#000000", border: "1px solid #A84D12", padding: "16px 48px", fontSize: "12px", letterSpacing: "0.5px", textTransform: "none", fontFamily: "'Karla',sans-serif", fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "12px", borderRadius: 0 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                {content.btn}
              </button>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          <div style={{ position: "relative", height: "280px", marginBottom: "40px", overflow: "hidden" }}>
            <Image src="/images/clinic-reception.png" alt="Clinic" fill style={{ objectFit: "cover" }} sizes="30vw" />
          </div>
          <div style={{ padding: "32px", background: "var(--card)", border: "0.5px solid rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "16px" }}>{content.info}</div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "24px", fontWeight: 300, color: "#0F0F0F", marginBottom: "8px" }}>+972 54 799 7273</div>
            <div style={{ fontSize: "12px", color: "#888", lineHeight: 1.8 }}>Deir Hanna, Northern District</div>
            <div style={{ fontSize: "12px", color: "#888" }}>@dr.yarasalem_clinic</div>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
