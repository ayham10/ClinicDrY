"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Lang } from "@/lib/i18n";

const treatmentData: Record<string, {
  image: string;
  en: { name: string; tagline: string; intro: string; benefits: string[]; process: string[] };
  ar: { name: string; tagline: string; intro: string; benefits: string[]; process: string[] };
}> = {
  "invisalign": {
    image: "/images/dr-yara.png",
    en: {
      name: "Invisalign",
      tagline: "Invisible. Comfortable. Effective.",
      intro: "Invisalign uses a series of custom-made, clear removable aligners to gradually straighten teeth — no metal wires or brackets. Dr. Yara Salem is a certified Invisalign provider, creating personalized treatment plans for each patient.",
      benefits: ["Virtually invisible — no one will know", "Removable for eating and cleaning", "Comfortable — no sharp metal edges", "Fewer dental visits required", "Proven results in 6–18 months"],
      process: ["Consultation & 3D scan", "Custom aligner fabrication", "Aligner fitting & instructions", "Progress check-ups every 6–8 weeks", "Retainer fitting after completion"],
    },
    ar: {
      name: "الإينفيزالاين",
      tagline: "غير مرئي. مريح. فعّال.",
      intro: "يستخدم الإينفيزالاين سلسلة من المحاذيات الشفافة القابلة للإزالة المصممة خصيصًا لتقويم الأسنان تدريجيًا — بدون أسلاك أو أقواس معدنية.",
      benefits: ["شفاف تقريبًا — لن يلاحظه أحد", "قابل للإزالة عند الأكل والتنظيف", "مريح — بدون حواف معدنية حادة", "زيارات أقل للعيادة", "نتائج مثبتة في 6-18 شهرًا"],
      process: ["استشارة وفحص ثلاثي الأبعاد", "تصنيع المحاذيات المخصصة", "تركيب المحاذيات والتعليمات", "متابعة التقدم كل 6-8 أسابيع", "تركيب حامل بعد الاكتمال"],
    },
  },
  "botox-fillers": {
    image: "/images/clinic-roses.png",
    en: {
      name: "Botox & Fillers",
      tagline: "Youth. Refined.",
      intro: "Dr. Yara Salem offers the finest medical-grade injectable treatments — from Botox to hyaluronic acid fillers — to smooth lines, restore volume, and enhance facial harmony with completely natural-looking results.",
      benefits: ["Natural, subtle results", "No downtime required", "Results visible within days", "Long-lasting (6–18 months)", "Medical-grade certified products only"],
      process: ["Facial assessment & goal-setting", "Treatment area mapping", "Topical numbing application", "Precise injection procedure", "Post-treatment care instructions"],
    },
    ar: {
      name: "البوتوكس والفيلر",
      tagline: "الشباب. بأناقة.",
      intro: "تقدم د. يارا سالم أفضل علاجات الحقن الطبية — من البوتوكس إلى فيلر حمض الهيالورونيك — لتنعيم التجاعيد واستعادة الحجم وتعزيز توازن الوجه بنتائج طبيعية.",
      benefits: ["نتائج طبيعية وخفية", "لا يتطلب وقت تعافٍ", "النتائج ظاهرة خلال أيام", "طويلة الأمد (6-18 شهرًا)", "منتجات طبية معتمدة فقط"],
      process: ["تقييم الوجه وتحديد الأهداف", "تحديد مناطق العلاج", "تطبيق تخدير موضعي", "إجراء الحقن بدقة", "تعليمات العناية بعد العلاج"],
    },
  },
  "implants-veneers": {
    image: "/images/clinic-reception.png",
    en: {
      name: "Implants & Veneers",
      tagline: "Permanent. Flawless.",
      intro: "Whether you need a single tooth replaced or a complete smile transformation, Dr. Salem specializes in both titanium implants and hand-crafted porcelain veneers that blend seamlessly with your natural teeth.",
      benefits: ["Looks and feels completely natural", "Porcelain veneers in as few as 2 visits", "Titanium implants: a lifetime solution", "Stain-resistant porcelain material", "Enhances tooth shape, size & color"],
      process: ["Full dental assessment & X-rays", "Treatment plan & smile design", "Tooth preparation appointment", "Temporary placement & review", "Final fitting & permanent bonding"],
    },
    ar: {
      name: "الزراعة والقشور",
      tagline: "دائم. لا تشوب.",
      intro: "سواء كنت بحاجة إلى استبدال سن واحدة أو تحويل ابتسامتك بالكامل، تتخصص د. سالم في زراعة التيتانيوم وقشور البورسلين المصنوعة يدويًا.",
      benefits: ["تبدو وتشعر بشكل طبيعي تمامًا", "قشور البورسلين في زيارتين فقط", "زراعة التيتانيوم: حل مدى الحياة", "بورسلين مقاوم للبقع", "يعزز شكل ولون الأسنان"],
      process: ["تقييم أسنان كامل وأشعة سينية", "خطة العلاج وتصميم الابتسامة", "موعد تحضير الأسنان", "التثبيت المؤقت والمراجعة", "التركيب النهائي والتثبيت الدائم"],
    },
  },
  "general-dentistry": {
    image: "/images/dr-yara.png",
    en: {
      name: "General Dentistry",
      tagline: "Foundation of Health.",
      intro: "Prevention is the foundation of a beautiful, healthy smile. Dr. Salem's general dentistry services cover everything from routine check-ups and cleanings to fillings, extractions, and root canals — all in a luxury, stress-free environment.",
      benefits: ["Comprehensive oral health assessment", "Professional cleaning & polishing", "Early detection of problems", "Comfortable, anxiety-free experience", "Modern digital X-ray technology"],
      process: ["Initial examination & digital X-rays", "Professional cleaning & scaling", "Treatment planning if required", "Preventive care recommendations", "Scheduled follow-up visits"],
    },
    ar: {
      name: "طب الأسنان العام",
      tagline: "أساس الصحة.",
      intro: "الوقاية هي أساس الابتسامة الجميلة والصحية. تغطي خدمات طب الأسنان العامة لد. سالم كل شيء من الفحوصات الروتينية والتنظيف إلى الحشوات والخلع وعلاج الجذور.",
      benefits: ["تقييم شامل لصحة الفم", "تنظيف وتلميع احترافي", "الكشف المبكر عن المشاكل", "تجربة مريحة خالية من القلق", "تقنية أشعة سينية رقمية حديثة"],
      process: ["الفحص الأولي والأشعة الرقمية", "التنظيف الاحترافي والتقشير", "تخطيط العلاج إذا لزم الأمر", "توصيات الرعاية الوقائية", "زيارات متابعة منتظمة"],
    },
  },
};

export default function TreatmentDetailPage() {
  const [lang, setLang] = useState<Lang>("en");
  const params = useParams();
  const slug = params?.slug as string;
  const dir = lang === "ar" ? "rtl" : "ltr";
  const treatment = treatmentData[slug];

  if (!treatment) {
    return (
      <div dir={dir} style={{ background: "var(--off-white)" }}>
        <Navbar lang={lang} onLangChange={setLang} />
        <div style={{ padding: "200px 48px", textAlign: "center" }}>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "32px", color: "#888" }}>Treatment not found.</p>
          <Link href="/treatments" style={{ marginTop: "24px", display: "inline-block", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#D4621A" }}>← Back to Treatments</Link>
        </div>
        <Footer lang={lang} />
      </div>
    );
  }

  const info = lang === "en" ? treatment.en : treatment.ar;

  return (
    <div dir={dir} style={{ background: "var(--off-white)" }}>
      <Navbar lang={lang} onLangChange={setLang} />

      {/* Hero */}
      <div style={{ paddingTop: "72px", position: "relative", overflow: "hidden", height: "520px" }}>
        <Image src={treatment.image} alt={info.name} fill style={{ objectFit: "cover", objectPosition: "top center" }} priority />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(15,15,15,0.25) 0%, rgba(15,15,15,0.85) 100%)" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 50% 60% at 50% 80%, rgba(212,98,26,0.15) 0%, transparent 70%)" }} />
        <div style={{
          position: "relative", zIndex: 1, height: "100%",
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "flex-end", textAlign: "center", padding: "0 48px 64px",
        }}>
          <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#D4621A", marginBottom: "14px" }}>
            {lang === "en" ? "Our Treatment" : "علاجنا"}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(40px,6vw,68px)", fontWeight: 300, color: "white", marginBottom: "10px", lineHeight: 1 }}>
            {info.name}
          </h1>
          <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "22px", fontStyle: "italic", color: "#D4621A" }}>
            {info.tagline}
          </p>
        </div>
        {/* Bottom accent line */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(to right, transparent, #D4621A, transparent)" }} />
      </div>

      {/* Main content */}
      <section style={{ padding: "80px 48px", display: "grid", gridTemplateColumns: "1.5fr 1fr", gap: "80px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* Left: intro + process */}
        <div>
          <p style={{ fontSize: "15px", color: "#555", lineHeight: 2.0, marginBottom: "56px" }}>{info.intro}</p>

          {/* Process steps */}
          <div>
            <div style={{ fontSize: "10px", letterSpacing: "3.5px", textTransform: "uppercase", color: "#D4621A", marginBottom: "28px" }}>
              {lang === "en" ? "The Process" : "كيف يتم ذلك"}
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {info.process.map((step, i) => (
                <div key={i} style={{
                  display: "flex", alignItems: "center", gap: "20px",
                  padding: "18px 0",
                  borderBottom: i < info.process.length - 1 ? "0.5px solid rgba(0,0,0,0.07)" : "none",
                }}>
                  <div style={{
                    width: "36px", height: "36px", flexShrink: 0,
                    border: "0.5px solid rgba(212,98,26,0.4)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Cormorant Garamond',serif", fontSize: "16px", color: "#D4621A",
                  }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <span style={{ fontSize: "13px", color: "#555", lineHeight: 1.6 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div style={{ marginTop: "48px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <Link href="/booking" style={{
              fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase",
              background: "#D4621A", color: "#000000", padding: "14px 36px", border: "1px solid #A84D12", borderRadius: 0,
              textDecoration: "none", fontFamily: "'Jost',sans-serif", fontWeight: 500,
            }}>
              {lang === "en" ? "Book This Treatment" : "احجز هذا العلاج"}
            </Link>
            <Link href="/treatments" style={{
              fontSize: "10px", letterSpacing: "2.5px", textTransform: "uppercase",
              background: "transparent", color: "#0F0F0F", padding: "15px 32px",
              border: "1px solid #0F0F0F", textDecoration: "none",
              fontFamily: "'Jost',sans-serif",
            }}>
              {lang === "en" ? "All Treatments" : "جميع العلاجات"}
            </Link>
          </div>
        </div>

        {/* Right: benefits + contact card */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {/* Benefits card */}
          <div style={{ background: "var(--card)", padding: "40px", border: "0.5px solid rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "10px", letterSpacing: "3.5px", textTransform: "uppercase", color: "#D4621A", marginBottom: "28px" }}>
              {lang === "en" ? "Key Benefits" : "الفوائد الرئيسية"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
              {info.benefits.map((b, i) => (
                <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                  <span style={{ color: "#D4621A", fontSize: "10px", marginTop: "3px", flexShrink: 0 }}>✦</span>
                  <span style={{ fontSize: "13px", color: "#444", lineHeight: 1.7 }}>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mini contact card */}
          <div style={{ background: "#0F0F0F", padding: "36px" }}>
            <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#D4621A", marginBottom: "16px" }}>
              {lang === "en" ? "Have Questions?" : "لديك أسئلة؟"}
            </div>
            <p style={{ fontSize: "13px", color: "#777", lineHeight: 1.8, marginBottom: "24px" }}>
              {lang === "en"
                ? "Call us or send a WhatsApp message and Dr. Salem's team will answer within hours."
                : "اتصل بنا أو أرسل رسالة واتساب وسيرد فريق د. سالم خلال ساعات."}
            </p>
            <a
              href="https://wa.me/972547997273"
              target="_blank"
              rel="noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: "10px",
                fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase",
                background: "#D4621A", color: "#000000", padding: "12px 24px", border: "1px solid #A84D12", borderRadius: 0,
                textDecoration: "none", fontFamily: "'Jost',sans-serif", fontWeight: 500,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#000000">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              {lang === "en" ? "WhatsApp Us" : "واتساب"}
            </a>
          </div>
        </div>
      </section>

      {/* Bottom: other treatments */}
      <section style={{ padding: "0 48px 100px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ borderTop: "0.5px solid rgba(0,0,0,0.08)", paddingTop: "60px" }}>
          <div style={{ fontSize: "10px", letterSpacing: "3.5px", textTransform: "uppercase", color: "#888", marginBottom: "32px" }}>
            {lang === "en" ? "Other Treatments" : "علاجات أخرى"}
          </div>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {Object.entries(treatmentData)
              .filter(([key]) => key !== slug)
              .map(([key, val]) => (
                <Link key={key} href={`/treatments/${key}`} style={{
                  fontSize: "11px", letterSpacing: "1.5px", textTransform: "uppercase",
                  padding: "12px 24px", border: "0.5px solid rgba(0,0,0,0.15)",
                  color: "#555", textDecoration: "none", fontFamily: "'Jost',sans-serif",
                  transition: "all 0.2s", background: "var(--card)",
                }}>
                  {lang === "en" ? val.en.name : val.ar.name}
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}
