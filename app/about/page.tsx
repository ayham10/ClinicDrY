"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lang } from "@/lib/i18n";

export default function AboutPage() {
  const [lang, setLang] = useState<Lang>("en");
  const dir = lang === "ar" ? "rtl" : "ltr";

  const content = {
    en: {
      eyebrow: "Our Story",
      title: "Dr. Yara",
      italic: "Salem",
      bio1: "Dr. Yara Salem is a distinguished specialist in dental and facial aesthetics with over 10 years of clinical experience. She completed her dental degree with honors and pursued advanced training in facial aesthetics, cosmetic dentistry, and implantology.",
      bio2: "Her clinic in Deir Hanna stands as a landmark of luxury medical care in the region — featuring a stunning interior with black chandeliers, marble floors, and an environment designed to make every patient feel like royalty.",
      bio3: "Dr. Yara believes that beauty and confidence are deeply connected. Every treatment she provides is customized with care, precision, and an artistic eye that sets her apart from any other practice in the area.",
      credentials: "Credentials & Training",
      cred: ["Doctor of Dental Surgery (DDS)", "Advanced Certificate in Facial Aesthetics", "Invisalign Certified Provider", "Specialist in Cosmetic Implantology", "10+ Years Clinical Practice"],
      philosophy: "Her Philosophy",
      phil: "\"Every patient deserves to leave feeling more confident than when they arrived. Beauty is not about perfection — it's about harmony, health, and confidence.\"",
      book: "Book a Consultation",
    },
    ar: {
      eyebrow: "قصتنا",
      title: "د. يارا",
      italic: "سالم",
      bio1: "د. يارا سالم متخصصة مرموقة في طب الأسنان وجماليات الوجه بخبرة سريرية تمتد لأكثر من 10 سنوات. أتمت شهادتها في طب الأسنان بامتياز وتابعت تدريبًا متقدمًا في جماليات الوجه وطب الأسنان التجميلي وزراعة الأسنان.",
      bio2: "تُعدّ عيادتها في دير حنا معلمًا للرعاية الطبية الفاخرة في المنطقة — بتصميم داخلي مذهل يضم ثريات سوداء، وأرضيات رخامية، وبيئة مصممة لجعل كل مريض يشعر بالملكية.",
      bio3: "تؤمن د. يارا بأن الجمال والثقة مرتبطان ارتباطًا وثيقًا. كل علاج تقدمه يتم تخصيصه بعناية ودقة وعين فنية تميزها عن أي عيادة أخرى في المنطقة.",
      credentials: "المؤهلات والتدريب",
      cred: ["دكتوراه في جراحة الأسنان (DDS)", "شهادة متقدمة في جماليات الوجه", "مزودة معتمدة من Invisalign", "متخصصة في زراعة الأسنان التجميلية", "+10 سنوات من الممارسة السريرية"],
      philosophy: "فلسفتها",
      phil: "\"كل مريض يستحق أن يغادر وهو يشعر بثقة أكبر مما كان عليه عند الوصول. الجمال لا يتعلق بالكمال — بل يتعلق بالتناسق والصحة والثقة.\"",
      book: "احجز استشارة",
    },
  };

  const c = content[lang];

  return (
    <div dir={dir} style={{ background: "var(--off-white)" }}>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* Hero */}
      <div style={{ paddingTop: "72px", background: "#0F0F0F", position: "relative", overflow: "hidden", height: "400px" }}>
        <Image src="/images/clinic-reception.png" alt="Clinic" fill style={{ objectFit: "cover", opacity: 0.25 }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(212,98,26,0.12) 0%, transparent 70%)" }} />
        <div style={{ position: "relative", zIndex: 1, height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#D4621A", marginBottom: "16px" }}>{c.eyebrow}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(40px,6vw,72px)", fontWeight: 300, color: "white" }}>
            {c.title} <em style={{ fontStyle: "italic", color: "#D4621A" }}>{c.italic}</em>
          </h1>
        </div>
      </div>

      {/* Main content */}
      <section style={{ padding: "100px 48px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start", maxWidth: "1200px", margin: "0 auto" }}>
        {/* Photo */}
        <div style={{ position: "relative", height: "640px", flexShrink: 0 }}>
          <Image src="/images/dr-yara.png" alt="Dr. Yara Salem" fill style={{ objectFit: "cover", objectPosition: "top center" }} sizes="50vw" />
          <div style={{ position: "absolute", right: "-20px", bottom: "-20px", width: "55%", height: "55%", border: "1px solid rgba(212,98,26,0.2)", pointerEvents: "none" }} />
        </div>

        {/* Text */}
        <div>
          <p style={{ fontSize: "15px", color: "#444", lineHeight: 2, marginBottom: "24px" }}>{c.bio1}</p>
          <p style={{ fontSize: "15px", color: "#444", lineHeight: 2, marginBottom: "24px" }}>{c.bio2}</p>
          <p style={{ fontSize: "15px", color: "#444", lineHeight: 2, marginBottom: "48px" }}>{c.bio3}</p>

          {/* Credentials */}
          <div style={{ marginBottom: "40px" }}>
            <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "20px" }}>{c.credentials}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {c.cred.map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: "#444" }}>
                  <span style={{ width: "4px", height: "4px", background: "#D4621A", transform: "rotate(45deg)", display: "block", flexShrink: 0 }} />
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Philosophy quote */}
          <div style={{ borderLeft: "2px solid #D4621A", paddingLeft: "24px", marginBottom: "40px" }}>
            <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "12px" }}>{c.philosophy}</div>
            <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "22px", fontStyle: "italic", fontWeight: 300, color: "#2a2218", lineHeight: 1.7 }}>{c.phil}</p>
          </div>

          <Link href="/booking" style={{ fontSize: "11px", letterSpacing: "0.5px", textTransform: "none", background: "#D4621A", color: "#000000", padding: "14px 36px", textDecoration: "none", fontFamily: "'Karla',sans-serif", fontWeight: 600, border: "1px solid #A84D12", borderRadius: 0 }}>
            {c.book}
          </Link>
        </div>
      </section>

      {/* Clinic photos row */}
      <section style={{ padding: "0 48px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {["/images/clinic-reception.png", "/images/clinic-roses.png"].map((src, i) => (
            <div key={i} style={{ position: "relative", height: "320px", overflow: "hidden" }}>
              <Image src={src} alt="Clinic" fill style={{ objectFit: "cover", transition: "transform 0.6s" }} sizes="50vw" />
            </div>
          ))}
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
