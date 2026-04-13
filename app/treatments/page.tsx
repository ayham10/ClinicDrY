"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { translations, Lang } from "@/lib/i18n";

export default function TreatmentsPage() {
  const [lang, setLang] = useState<Lang>("en");
  const t = translations[lang];
  const dir = t.dir;

  const treatments = [
    {
      slug: "invisalign",
      image: "/images/dr-yara.png",
      color: "#D4621A",
      en: { name: "Invisalign", tagline: "Invisible. Comfortable. Effective.", desc: "Custom clear aligners designed to straighten your teeth discreetly. No wires, no brackets — just a beautiful, confident smile." },
      ar: { name: "الإينفيزالاين", tagline: "غير مرئي. مريح. فعّال.", desc: "تقويم أسنان شفاف مخصص لتقويم أسنانك بشكل غير ملحوظ. بدون أسلاك أو أقواس — فقط ابتسامة جميلة وواثقة." },
    },
    {
      slug: "botox-fillers",
      image: "/images/clinic-roses.png",
      color: "#D4621A",
      en: { name: "Botox & Fillers", tagline: "Youth. Refined.", desc: "Medical-grade injectable treatments that smooth fine lines, restore volume, and rejuvenate your appearance naturally." },
      ar: { name: "البوتوكس والفيلر", tagline: "الشباب. بأناقة.", desc: "علاجات حقن طبية تزيل التجاعيد الدقيقة، وتعيد الحجم، وتجدد مظهرك بشكل طبيعي." },
    },
    {
      slug: "implants-veneers",
      image: "/images/clinic-reception.png",
      color: "#D4621A",
      en: { name: "Implants & Veneers", tagline: "Permanent. Flawless.", desc: "Titanium implants and hand-crafted porcelain veneers that look, feel, and function like your natural teeth." },
      ar: { name: "الزراعة والقشور", tagline: "دائم. لا تشوب.", desc: "زراعة تيتانيوم وقشور بورسلين مصنوعة يدويًا تبدو وتشعر وتعمل مثل أسنانك الطبيعية." },
    },
    {
      slug: "general-dentistry",
      image: "/images/dr-yara.png",
      color: "#D4621A",
      en: { name: "General Dentistry", tagline: "Foundation of Health.", desc: "Comprehensive preventive and restorative dental care delivered in a luxury setting with the utmost comfort." },
      ar: { name: "طب الأسنان العام", tagline: "أساس الصحة.", desc: "رعاية أسنان وقائية وترميمية شاملة في بيئة فاخرة مع أقصى درجات الراحة." },
    },
  ];

  return (
    <div dir={dir} style={{ background: "var(--off-white)" }}>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* Page hero */}
      <div style={{ paddingTop: "72px", background: "#0F0F0F", position: "relative", overflow: "hidden", height: "360px" }}>
        <Image src="/images/clinic-reception.png" alt="Treatments" fill style={{ objectFit: "cover", opacity: 0.2 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212,98,26,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#D4621A", marginBottom: "16px" }}>
            {lang === "en" ? "What We Offer" : "ما نقدمه"}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px,6vw,64px)", fontWeight: 300, color: "white" }}>
            {lang === "en" ? (<>Our <em style={{ fontStyle: "italic", color: "#D4621A" }}>Treatments</em></>) : (<><em style={{ fontStyle: "italic", color: "#D4621A" }}>علاجاتنا</em></>)}
          </h1>
        </div>
      </div>

      {/* Treatments list */}
      <section style={{ padding: "80px 48px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px", background: "rgba(0,0,0,0.06)" }}>
          {treatments.map((tr, i) => {
            const info = lang === "en" ? tr.en : tr.ar;
            return (
              <Link key={tr.slug} href={`/treatments/${tr.slug}`} style={{ textDecoration: "none" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: i % 2 === 0 ? "1fr 1.2fr" : "1.2fr 1fr",
                  background: "var(--card)",
                  overflow: "hidden",
                  transition: "all 0.3s",
                  minHeight: "360px",
                }}>
                  {/* Image */}
                  <div style={{ order: i % 2 === 0 ? 0 : 1, position: "relative" }}>
                    <Image src={tr.image} alt={info.name} fill style={{ objectFit: "cover", transition: "transform 0.6s" }} sizes="50vw" />
                    <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, rgba(212,98,26,0.15) 0%, transparent 60%)" }} />
                  </div>
                  {/* Text */}
                  <div style={{ order: i % 2 === 0 ? 1 : 0, padding: "60px 56px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "16px" }}>0{i + 1}</div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "40px", fontWeight: 300, color: "#0F0F0F", marginBottom: "8px" }}>{info.name}</h2>
                    <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "18px", fontStyle: "italic", color: "#D4621A", marginBottom: "20px" }}>{info.tagline}</div>
                    <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.9, marginBottom: "32px" }}>{info.desc}</p>
                    <div style={{ fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase", color: "#D4621A", display: "flex", alignItems: "center", gap: "10px" }}>
                      {lang === "en" ? "Learn More" : "اعرف أكثر"}
                      <span style={{ display: "block", width: "24px", height: "0.5px", background: "#D4621A" }} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 48px", textAlign: "center", background: "#0F0F0F" }}>
        <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "44px", fontWeight: 300, color: "white", marginBottom: "24px" }}>
          {lang === "en" ? <>Ready to <em style={{ fontStyle: "italic", color: "#D4621A" }}>Begin?</em></> : <>مستعد <em style={{ fontStyle: "italic", color: "#D4621A" }}>للبدء؟</em></>}
        </h2>
        <Link href="/booking" style={{ fontSize: "12px", letterSpacing: "0.5px", textTransform: "none", background: "#D4621A", color: "#000000", padding: "16px 48px", textDecoration: "none", fontFamily: "'Karla',sans-serif", fontWeight: 600, border: "1px solid #A84D12", borderRadius: 0 }}>
          {lang === "en" ? "Book Appointment" : "احجز موعد"}
        </Link>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
