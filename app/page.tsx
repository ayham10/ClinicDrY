"use client";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { translations, Lang } from "@/lib/i18n";

/* ─── Before/After Data ─── */
const beforeAfterItems = [
  { id: 1, category: "Veneers", img: "/images/ba-teeth-1.png", label: "Smile Makeover" },
  { id: 2, category: "Veneers", img: "/images/beed.png", label: "Full Veneers" },
  { id: 3, category: "Lip Filler", img: "/images/ba-lips-1.png", label: "Lip Enhancement" },
  { id: 4, category: "Veneers", img: "/images/ba-veneers-1.png", label: "Porcelain Veneers" },
  { id: 5, category: "Veneers", img: "/images/ba-veneers-2.png", label: "Smile Design" },
  { id: 6, category: "Lip Filler", img: "/images/ba-lips-2.png", label: "Natural Filler" },
  { id: 7, category: "Veneers", img: "/images/ba-teeth-3.png", label: "Complete Makeover" },
  { id: 8, category: "Lip Filler", img: "/images/ba-lips-3.png", label: "Lip Volume" },
  { id: 9, category: "Lip Filler", img: "/images/ba-lips-4.png", label: "Lip Reshape" },
];

const categories = ["All", "Veneers", "Lip Filler"];

const HERO_VIDEO_SRC = "/images/LandingPage.mp4";

/** Treatment photography — local highlights + Unsplash fallbacks */
const SERVICE_IMAGES: Record<string, string> = {
  invisalign: "/images/invsling.png",
  "botox-fillers": "/images/lips2.png",
  "implants-veneers": "/images/implem.png",
  "general-dentistry": "/images/gen.png",
};

/** Extra carousel-only slides (same slugs for booking deep-links) */
const SERVICE_SLIDER_EXTRAS: { slug: keyof typeof SERVICE_IMAGES; en: { name: string; desc: string }; ar: { name: string; desc: string }; image: string }[] = [
  {
    slug: "implants-veneers",
    en: { name: "Premium Veneers", desc: "Layered porcelain for shape, shade, and symmetry — a red-carpet smile that still looks like you." },
    ar: { name: "قشور بريميوم", desc: "بورسلين طبقات للشكل واللون والتناسق — ابتسامة فاخرة وطبيعية." },
    image: "/images/venners.png",
  },
  {
    slug: "general-dentistry",
    en: { name: "Teeth Whitening", desc: "Controlled, comfortable whitening for a noticeably brighter smile without compromising enamel." },
    ar: { name: "تبييض الأسنان", desc: "تبييض آمن ومريح لابتسامة أنقى دون المساس بالمينا." },
    image: "/images/beed.png",
  },
];

/* ─── Testimonials ─── */
const testimonials = [
  { name: "Sara K.", text: "Dr. Yara transformed my smile completely. The veneers look so natural — everyone thinks I was born with them.", stars: 5 },
  { name: "Lina M.", text: "The lip filler treatment was perfect. She has such a gentle touch and the results are exactly what I wanted.", stars: 5 },
  { name: "Rami A.", text: "Best dental experience I've ever had. The clinic is stunning and Dr. Yara is incredibly skilled.", stars: 5 },
  { name: "Nadia S.", text: "I was nervous about Invisalign but Dr. Yara made the whole process easy. My teeth look amazing now.", stars: 5 },
];

/* ─── Why Choose Us ─── */
const whyItems = [
  { icon: "◈", title: "Luxury Environment", desc: "A clinic designed to feel like a 5-star experience, from arrival to treatment." },
  { icon: "✦", title: "10+ Years Expertise", desc: "Over a decade of specialized training in dental and facial aesthetics." },
  { icon: "◇", title: "Personalized Care", desc: "Every treatment plan is uniquely crafted around your face, goals, and lifestyle." },
  { icon: "◉", title: "Natural Results", desc: "We enhance your natural beauty — never overdone, always perfect." },
];

export default function HomePage() {
  const [lang, setLang] = useState<Lang>("en");
  const [baFilter, setBaFilter] = useState("All");
  const [svcSlide, setSvcSlide] = useState(0);
  const t = translations[lang];
  const dir = t.dir;

  const filtered = baFilter === "All" ? beforeAfterItems : beforeAfterItems.filter(i => i.category === baFilter);

  const treatmentSlides = useMemo(() => {
    const base = t.services.items.map(svc => ({
      slug: svc.slug,
      name: svc.name,
      desc: svc.desc,
      image: SERVICE_IMAGES[svc.slug] ?? SERVICE_IMAGES.invisalign,
    }));
    const extras = SERVICE_SLIDER_EXTRAS.map(x => ({
      slug: x.slug,
      name: lang === "en" ? x.en.name : x.ar.name,
      desc: lang === "en" ? x.en.desc : x.ar.desc,
      image: x.image,
    }));
    return [...base, ...extras];
  }, [t.services.items, lang]);

  useEffect(() => {
    const n = treatmentSlides.length;
    if (n === 0) return;
    const id = window.setInterval(() => setSvcSlide(i => (i + 1) % n), 5200);
    return () => window.clearInterval(id);
  }, [treatmentSlides.length]);

  useEffect(() => {
    setSvcSlide(0);
  }, [lang]);

  const activeSlide = treatmentSlides[svcSlide] ?? treatmentSlides[0];

  useEffect(() => {
    document.querySelectorAll("[data-reveal].revealed").forEach(el => el.classList.remove("revealed"));
    const nodes = document.querySelectorAll("[data-reveal]");
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      entries => {
        entries.forEach(en => {
          if (en.isIntersecting) en.target.classList.add("revealed");
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -32px 0px" }
    );
    nodes.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [lang]);

  return (
    <div dir={dir} className="home-page-root" style={{ background: "var(--off-white)", overflowX: "hidden", width: "100%", maxWidth: "100%" }}>
      <style>{`
        /* ── LAYOUT ── */
        /* Hero: true viewport width (100vw breakout) so video is never “inset” from scrollbar / parent width */
        .home-page-root .hero-split {
          display:grid;
          grid-template-columns:1fr;
          grid-template-rows:minmax(100vh,auto);
          width:100vw;
          max-width:none;
          margin-inline:calc(50% - 50vw);
          margin-block:0;
          padding:0;
          position:relative;
          left:0;
          right:0;
          background:#0a0a0a;
          overflow:hidden;
        }
        .hero-split-video-bg {
          grid-column:1;
          grid-row:1;
          position:relative;
          z-index:0;
          min-height:100vh;
          min-height:100dvh;
          width:100%;
          max-width:none;
          overflow:hidden;
          background:#0a0a0a;
          pointer-events:none;
        }
        .hero-split-video-bg video {
          display:block;
          position:absolute;
          top:0;
          left:0;
          width:100%;
          height:100%;
          min-width:100%;
          min-height:100%;
          margin:0;
          object-fit:cover;
          object-position:center top;
          border:0;
          transform:scale(1.08);
          transform-origin:center top;
        }
        .hero-split-foreground {
          grid-column:1;
          grid-row:1;
          z-index:2;
          position:relative;
          display:flex;
          flex-direction:column;
          min-height:100vh;
          min-height:100dvh;
          width:100%;
          max-width:none;
        }
        .hero-split-video-bg::after {
          content:"";
          position:absolute;
          inset:0;
          pointer-events:none;
          background:linear-gradient(to right, rgba(15,15,15,0.12) 0%, transparent 48%, rgba(15,15,15,0.55) 82%, rgba(15,15,15,0.75) 100%),
            linear-gradient(to top, rgba(15,15,15,0.45) 0%, transparent 52%);
        }
        [dir="rtl"] .hero-split-video-bg::after {
          background:linear-gradient(to left, rgba(15,15,15,0.12) 0%, transparent 48%, rgba(15,15,15,0.55) 82%, rgba(15,15,15,0.75) 100%),
            linear-gradient(to top, rgba(15,15,15,0.45) 0%, transparent 52%);
        }
        .hero-split-inner {
          position:relative;
          flex:1 1 auto;
          display:flex;
          flex-direction:row;
          justify-content:flex-end;
          align-items:center;
          width:100%;
          max-width:100%;
          margin:0;
          padding:72px clamp(32px,7vw,96px) clamp(40px,7vh,72px);
          box-sizing:border-box;
        }
        [dir="rtl"] .hero-split-inner { justify-content:flex-start; }
        .hero-split-copy {
          position:relative;
          flex:0 1 min(720px,calc(100vw - clamp(64px,14vw,192px)));
          max-width:min(720px,calc(100vw - clamp(64px,14vw,192px)));
          width:100%;
          display:flex;
          flex-direction:column;
          justify-content:center;
          padding:clamp(28px,5vh,56px) clamp(12px,2.5vw,28px);
          margin:0;
          background:transparent;
        }
        .hero-split-copy-inner { width:100%; max-width:100%; }
        .hero-split-copy::before { content:""; position:absolute; top:0; left:0; width:3px; height:min(220px,28vh); background:linear-gradient(to bottom,#D4621A,rgba(212,98,26,0.2)); }
        .svc-slider-wrap { max-width:1240px; margin:0 auto; position:relative; }
        .svc-slider-card { display:grid; grid-template-columns:1.15fr 1fr; min-height:min(420px,70vw); background:#0F0F0F; overflow:hidden; box-shadow:0 32px 90px rgba(0,0,0,0.18); }
        .svc-slider-visual { position:relative; min-height:300px; }
        .svc-slider-copy { padding:clamp(36px,4vw,56px) clamp(28px,3vw,48px); display:flex; flex-direction:column; justify-content:center; background:linear-gradient(145deg,#0F0F0F 0%,#1a1512 100%); }
        .svc-slider-dots { display:flex; justify-content:center; gap:10px; margin-top:28px; flex-wrap:wrap; }
        .svc-dot { width:8px; height:8px; border-radius:50%; border:none; padding:0; cursor:pointer; background:rgba(212,98,26,0.25); transition:background 0.25s, transform 0.25s; }
        .svc-dot.active { background:#D4621A; transform:scale(1.15); }
        @keyframes svcSlideFade { from { opacity:0.4; transform:scale(1.03); } to { opacity:1; transform:scale(1); } }
        .svc-slider-fade { animation:svcSlideFade 0.55s ease both; }
        [data-reveal] { opacity:0; transform:translateY(36px); transition:opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1); }
        [data-reveal].revealed { opacity:1; transform:translateY(0); }
        .services-grid-4 { display:grid; grid-template-columns:repeat(4,1fr); gap:1px; background:rgba(0,0,0,0.06); }
        .why-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:24px; }
        .expertise-strip { display:flex; flex-wrap:wrap; gap:0; }
        .ba-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:16px; }
        .about-split { display:grid; grid-template-columns:1fr 1fr; gap:80px; align-items:center; }
        .testimonial-grid { display:grid; grid-template-columns:repeat(2,1fr); gap:24px; }

        /* ── SERVICE CARD ── */
        .svc-card { background:var(--card); padding:48px 32px; position:relative; overflow:hidden; height:100%; transition:all 0.35s; cursor:pointer; border-bottom:3px solid transparent; }
        .svc-card:hover { background:#fff8f5; border-bottom-color:#D4621A; transform:translateY(-4px); box-shadow:0 20px 60px rgba(0,0,0,0.08); }

        /* ── BA CARD ── */
        .ba-card { position:relative; overflow:hidden; cursor:pointer; }
        .ba-card img { transition:transform 0.6s ease; }
        .ba-card:hover img { transform:scale(1.04); }
        .ba-overlay { position:absolute; inset:0; background:linear-gradient(to top, rgba(15,15,15,0.7) 0%, transparent 50%); opacity:0; transition:opacity 0.3s; }
        .ba-card:hover .ba-overlay { opacity:1; }

        /* ── WHY CARD ── */
        .why-card { background:var(--card); padding:36px 28px; border:0.5px solid rgba(0,0,0,0.06); transition:all 0.3s; }
        .why-card:hover { border-color:rgba(212,98,26,0.3); transform:translateY(-4px); box-shadow:0 16px 48px rgba(0,0,0,0.07); }

        /* ── EXPERTISE TAG ── */
        .exp-tag { padding:14px 28px; font-size:11px; letter-spacing:2px; text-transform:uppercase; color:#555; font-family:'Jost',sans-serif; border-right:0.5px solid rgba(0,0,0,0.08); white-space:nowrap; transition:all 0.2s; cursor:pointer; }
        .exp-tag:hover { color:#D4621A; background:rgba(212,98,26,0.04); }

        /* ── TESTIMONIAL ── */
        .testi-card { background:var(--card); padding:36px; border:0.5px solid rgba(0,0,0,0.06); transition:all 0.3s; }
        .testi-card:hover { border-color:rgba(212,98,26,0.2); box-shadow:0 12px 40px rgba(0,0,0,0.06); }

        /* ── ANIMATIONS ── */
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(36px)} to{opacity:1;transform:translateY(0)} }
        .anim { animation:fadeSlideUp 0.8s ease both; }
        .d1{animation-delay:0.1s} .d2{animation-delay:0.25s} .d3{animation-delay:0.4s} .d4{animation-delay:0.55s}

        /* ── MOBILE ── */
        @supports (min-height:100dvh){
          .home-page-root .hero-split{grid-template-rows:minmax(100dvh,auto)}
          .hero-split-video-bg{min-height:100dvh}
          .hero-split-foreground{min-height:100dvh}
        }
        @media(max-width:900px){
          .hero-split-video-bg video{transform:scale(1.1);transform-origin:center 22%;object-position:center 18%}
          .hero-split-video-bg::after{
            background:linear-gradient(to top, rgba(15,15,15,0.82) 0%, rgba(15,15,15,0.35) 45%, transparent 72%);
          }
          .hero-split-inner{
            justify-content:center;
            align-items:stretch;
            padding:72px 24px 48px;
          }
          [dir="rtl"] .hero-split-inner{justify-content:center}
          .hero-split-copy{
            flex:1 1 100%;
            max-width:100%;
            padding:32px 4px 28px;
            background:transparent;
          }
          .hero-split-copy::before{height:120px}
          .svc-slider-card{grid-template-columns:1fr;min-height:0}
          .svc-slider-visual{min-height:260px;order:0}
          .svc-slider-copy{order:1}
          .comfort-split{grid-template-columns:1fr!important;min-height:0}
          .comfort-visual{min-height:280px!important}
          .services-grid-4{grid-template-columns:repeat(2,1fr)}
          .why-grid{grid-template-columns:repeat(2,1fr)}
          .ba-grid{grid-template-columns:repeat(2,1fr)}
          .about-split{grid-template-columns:1fr;gap:40px}
          .testimonial-grid{grid-template-columns:1fr}
          section:not(.hero-split){padding-left:24px!important;padding-right:24px!important}
        }
        @media(max-width:540px){
          .services-grid-4{grid-template-columns:1fr}
          .why-grid{grid-template-columns:1fr}
          .ba-grid{grid-template-columns:1fr}
          .expertise-strip{flex-direction:column}
          .exp-tag{border-right:none;border-bottom:0.5px solid rgba(0,0,0,0.08)}
          .hero-btns{flex-direction:column}
          .hero-btns a{text-align:center}
        }
      `}</style>

      {/* ══════════════════════════════════════
          1. HERO — video full bleed; navbar + copy stacked on top (no solid panel)
      ══════════════════════════════════════ */}
      <section className="hero-split">
        <div className="hero-split-video-bg" aria-hidden>
          <video autoPlay muted loop playsInline preload="auto">
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        </div>
        <div className="hero-split-foreground">
        <Navbar lang={lang} onLangChange={setLang} transparentWhenTop />
        <div className="hero-split-inner">
          <div className="hero-split-copy">
          <div className="hero-split-copy-inner">
              <div className="anim d1" style={{ fontFamily:"'Sen',sans-serif", fontSize:"10px", letterSpacing:"3px", textTransform:"uppercase", color:"#D4621A", marginBottom:"16px", lineHeight:1.35, fontWeight:600 }}>
                {t.hero.eyebrow}
              </div>
              <h1 className="anim d2" style={{ fontFamily:lang==="en"?"'Sen',sans-serif":"'Cormorant Garamond',serif", fontSize:lang==="en"?"clamp(26px,2.8vw,40px)":"clamp(24px,2.6vw,36px)", fontWeight:lang==="en"?600:400, lineHeight:1.12, color:"#F5F0E8", marginBottom:"12px", textTransform:lang==="en"?"lowercase":"none", letterSpacing:lang==="en"?"-0.02em":"0" }}>
                {t.hero.headline1}
              </h1>
              <h2 className="anim d2" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(36px,4.2vw,62px)", fontWeight:300, lineHeight:1.05, color:"#FAFAF8", marginBottom:"16px", textTransform:lang==="en"?"lowercase":"none" }}>
                {t.hero.headline2}
              </h2>
              <div className="anim d2" style={{ fontFamily:"'Jost',sans-serif", fontSize:"12px", letterSpacing:"3px", textTransform:"uppercase", color:"rgba(245,240,232,0.55)", marginBottom:"20px" }}>{t.hero.subtitle}</div>
              <div className="anim d2" style={{ display:"flex", alignItems:"center", gap:"12px", marginBottom:"20px" }}>
                <div style={{ flex:1, height:"1px", background:"linear-gradient(to right,#D4621A,transparent)", maxWidth:"100px" }} />
                <div style={{ width:"6px", height:"6px", background:"#D4621A", transform:"rotate(45deg)" }} />
                <div style={{ flex:1, height:"1px", background:"linear-gradient(to left,#D4621A,transparent)", maxWidth:"100px" }} />
              </div>
              <div className="anim d3" style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(17px,1.8vw,22px)", fontWeight:400, fontStyle:"italic", color:"rgba(245,240,232,0.82)", lineHeight:1.4, marginBottom:"8px" }}>&ldquo;{t.hero.tagline}&rdquo;</div>
              <div className="anim d4" style={{ display:"flex", gap:"28px", marginTop:"28px", paddingTop:"22px", borderTop:"1px solid rgba(255,255,255,0.1)", flexWrap:"wrap" }}>
                {[{n:"10+",l:lang==="en"?"Years":"سنوات"},{n:"2000+",l:lang==="en"?"Patients":"مريض"},{n:"4",l:lang==="en"?"Specialties":"تخصصات"}].map(s=>(
                  <div key={s.n}>
                    <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(20px,2.2vw,26px)", fontWeight:400, color:"#D4621A", lineHeight:1 }}>{s.n}</div>
                    <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"9px", letterSpacing:"1.5px", textTransform:"uppercase", color:"rgba(245,240,232,0.45)", marginTop:"4px" }}>{s.l}</div>
                  </div>
                ))}
              </div>
            <div className="anim d4 hero-btns" style={{ display:"flex", flexDirection:"column", gap:"14px", marginTop:"32px", maxWidth:"min(400px,100%)" }}>
              <Link href="/booking" style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", background:"#D4621A", color:"#ffffff", padding:"14px 28px", textDecoration:"none", fontFamily:"'Jost',sans-serif", fontWeight:500, borderRadius:0, textAlign:"center", transition:"background 0.2s" }}>{t.hero.cta1}</Link>
              <Link href="/treatments" style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", background:"transparent", color:"#F5F0E8", padding:"13px 28px", textDecoration:"none", fontFamily:"'Jost',sans-serif", fontWeight:500, border:"1px solid rgba(212,98,26,0.45)", borderRadius:0, textAlign:"center", transition:"border-color 0.2s" }}>{t.hero.cta2}</Link>
              <a href={`tel:${t.nav.phone.replace(/[^\d+]/g, "")}`} style={{ fontFamily:"'Jost',sans-serif", fontSize:"12px", letterSpacing:"1px", color:"#D4621A", textDecoration:"none", textAlign:"center", marginTop:"4px" }}>
                {lang === "en" ? "Call or text" : "اتصل أو راسل"} {t.nav.phone}
              </a>
            </div>
          </div>
        </div>
        </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          2. TRUST STRIP
      ══════════════════════════════════════ */}
      <div style={{ background:"#0F0F0F", padding:"18px 48px", display:"flex", alignItems:"center", justifyContent:"center", gap:"48px", flexWrap:"wrap" }}>
        {[{i:"✦",l:lang==="en"?"Premium Dental & Aesthetic Care":"رعاية متميزة"},{i:"◈",l:"Deir Hanna, Israel"},{i:"◇",l:lang==="en"?"Online Booking":"حجز إلكتروني"},{i:"◉",l:lang==="en"?"10+ Years Excellence":"+10 سنوات تميز"}].map((x,i)=>(
          <div key={i} style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            <span style={{ color:"#D4621A", fontSize:"11px" }}>{x.i}</span>
            <span style={{ fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase", color:"#666" }}>{x.l}</span>
          </div>
        ))}
      </div>

      {/* ══════════════════════════════════════
          3. INTRO — Meet the doctors (duo portrait)
      ══════════════════════════════════════ */}
      <section data-reveal style={{ padding:"100px 48px", background:"var(--surface-soft)" }}>
        <div className="about-split">
                   <div style={{ position:"relative", width:"100%", height:"clamp(560px, 62vh, 760px)", minHeight:"520px" }}>
            <Image
              src="/images/DoctorsAhmed.png"
              alt={lang === "en" ? "Dr. Ahmad Salem and Dr. Yara Salem" : "د. أحمد سالم ود. يارا سالم"}
              fill
              style={{ objectFit:"cover", objectPosition:"center top" }}
              sizes="(max-width:900px) 100vw, 50vw"
              priority
            />
            <div style={{ position:"absolute", right:"-20px", bottom:"-20px", width:"55%", height:"55%", border:"1.5px solid rgba(212,98,26,0.2)", pointerEvents:"none" }} />
            <div style={{ position:"absolute", bottom:"32px", left:"-24px", background:"#D4621A", color:"#ffffff", padding:"20px 28px", boxShadow:"0 16px 48px rgba(212,98,26,0.3)" }}>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"32px", fontWeight:300, lineHeight:1 }}>{t.homeDoctors.badgeStat}</div>
              <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", marginTop:"4px", opacity:0.85 }}>{t.homeDoctors.badgeLabel}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#D4621A", marginBottom:"16px" }}>{t.homeDoctors.eyebrow}</div>
            <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(32px,3.5vw,52px)", fontWeight:300, lineHeight:1.1, marginBottom:"24px", color:"#0F0F0F" }}>
              {t.homeDoctors.title} <em style={{ fontStyle:"italic", color:"#D4621A" }}>{t.homeDoctors.titleItalic}</em>
            </h2>
            <p style={{ fontSize:"14px", color:"#555", lineHeight:2.0, marginBottom:"28px" }}>{t.homeDoctors.body}</p>
            {t.homeDoctors.bullets.map((item, i)=>(
              <div key={i} style={{ display:"flex", alignItems:"flex-start", gap:"14px", marginBottom:"16px" }}>
                <div style={{ width:"20px", height:"20px", background:"rgba(212,98,26,0.1)", border:"0.5px solid rgba(212,98,26,0.3)", display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"1px" }}>
                  <span style={{ color:"#D4621A", fontSize:"10px" }}>✓</span>
                </div>
                <span style={{ fontSize:"13px", color:"#444", lineHeight:1.7 }}>{item}</span>
              </div>
            ))}
            <div style={{ marginTop:"36px", display:"flex", gap:"16px", flexWrap:"wrap" }}>
              <Link href="/about" style={{ fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", background:"#0F0F0F", color:"white", padding:"16px 36px", textDecoration:"none", fontFamily:"'Jost',sans-serif", fontWeight:500 }}>
                {t.homeDoctors.learnMore}
              </Link>
              <Link href="/booking" style={{ fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", background:"transparent", color:"#D4621A", padding:"15px 32px", border:"1px solid #D4621A", textDecoration:"none", fontFamily:"'Jost',sans-serif" }}>
                {lang==="en"?"Book Consultation":"احجز استشارة"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          4. SERVICES (like Jackson's "our expertise" section)
      ══════════════════════════════════════ */}
      <section data-reveal style={{ padding:"100px 48px", background:"var(--surface)" }}>
        <div style={{ textAlign:"center", marginBottom:"48px" }}>
          <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#D4621A", marginBottom:"16px" }}>{t.services.eyebrow}</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:300, lineHeight:1.2, marginBottom:"16px", color:"#0F0F0F" }}>
            {t.services.title} <em style={{ fontStyle:"italic", color:"#D4621A" }}>{t.services.titleItalic}</em>
          </h2>
          <p style={{ fontSize:"13px", color:"#888", maxWidth:"460px", margin:"0 auto", lineHeight:1.8 }}>{t.services.subtitle}</p>
        </div>
        <div className="svc-slider-wrap">
          {activeSlide ? (
            <Link href={`/treatments/${activeSlide.slug}`} style={{ textDecoration:"none", color:"inherit", display:"block" }}>
              <div className="svc-slider-card">
                <div className="svc-slider-visual">
                  <div key={svcSlide} className="svc-slider-fade" style={{ position:"absolute", inset:0 }}>
                    <Image src={activeSlide.image} alt={activeSlide.name} fill style={{ objectFit:"cover" }} sizes="(max-width:900px) 100vw, 58vw" />
                  </div>
                </div>
                <div className="svc-slider-copy">
                  <div style={{ fontFamily:"'Jost',sans-serif", fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#D4621A", marginBottom:"12px" }}>
                    {String(svcSlide + 1).padStart(2, "0")} — {t.services.eyebrow}
                  </div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,3.2vw,42px)", fontWeight:400, color:"#fff", lineHeight:1.1, marginBottom:"16px" }}>{activeSlide.name}</h3>
                  <p style={{ fontSize:"14px", color:"rgba(255,255,255,0.72)", lineHeight:1.85, marginBottom:"28px", maxWidth:"420px" }}>{activeSlide.desc}</p>
                  <div style={{ fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", color:"#D4621A", display:"inline-flex", alignItems:"center", gap:"10px" }}>
                    {lang==="en"?"Explore treatment":"استكشف العلاج"}
                    <span style={{ display:"block", width:"28px", height:"1px", background:"#D4621A" }} />
                  </div>
                </div>
              </div>
            </Link>
          ) : null}
          <div className="svc-slider-dots" role="tablist" aria-label={lang==="en"?"Treatments":"العلاجات"}>
            {treatmentSlides.map((_, i) => (
              <button
                key={i}
                type="button"
                role="tab"
                aria-selected={i === svcSlide}
                className={`svc-dot${i === svcSlide ? " active" : ""}`}
                onClick={() => setSvcSlide(i)}
                aria-label={`${lang === "en" ? "Show slide" : "عرض الشريحة"} ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          5. EXPERTISE SCROLL STRIP (like Jackson's scrolling tags)
      ══════════════════════════════════════ */}
      <div style={{ background:"#0F0F0F", borderTop:"0.5px solid rgba(255,255,255,0.04)", borderBottom:"0.5px solid rgba(255,255,255,0.04)", overflow:"hidden" }}>
        <div style={{ display:"flex", animation:"scrollLeft 28s linear infinite", width:"max-content" }}>
          {[...Array(2)].map((_,rep)=>(
            ["Invisalign","Botox & Fillers","Porcelain Veneers","Lip Enhancement","Dental Implants","Smile Design","Teeth Whitening","General Dentistry","Facial Aesthetics","Composite Veneers"].map((tag,i)=>(
              <div key={`${rep}-${i}`} className="exp-tag" style={{ padding:"18px 36px", fontSize:"11px", letterSpacing:"2.5px", textTransform:"uppercase", color:"#555", fontFamily:"'Jost',sans-serif", borderRight:"0.5px solid rgba(255,255,255,0.05)", whiteSpace:"nowrap", flexShrink:0 }}>
                <span style={{ color:"#D4621A", marginRight:"10px" }}>✦</span>{tag}
              </div>
            ))
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════
          6. BEFORE & AFTER — The highlight section
      ══════════════════════════════════════ */}
      <section data-reveal style={{ padding:"100px 48px", background:"var(--surface-soft)" }}>
        <div style={{ textAlign:"center", marginBottom:"48px" }}>
          <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#D4621A", marginBottom:"16px" }}>
            {lang==="en"?"Real Results":"نتائج حقيقية"}
          </div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:300, lineHeight:1.2, marginBottom:"16px" }}>
            {lang==="en"?<>Before & <em style={{fontStyle:"italic",color:"#D4621A"}}>After</em></>:<>قبل <em style={{fontStyle:"italic",color:"#D4621A"}}>وبعد</em></>}
          </h2>
          <p style={{ fontSize:"13px", color:"#888", maxWidth:"400px", margin:"0 auto 36px", lineHeight:1.8 }}>
            {lang==="en"?"Real transformations. Real patients. All performed by Dr. Yara Salem.":"تحولات حقيقية. مرضى حقيقيون. جميعها بيد د. يارا سالم."}
          </p>
          {/* Filter tabs */}
          <div style={{ display:"inline-flex", gap:"0px", border:"0.5px solid rgba(0,0,0,0.12)", overflow:"hidden" }}>
            {categories.map(cat=>(
              <button key={cat} onClick={()=>setBaFilter(cat)} style={{
                padding:"12px 28px", fontSize:"10px", letterSpacing:"2px", textTransform:"uppercase",
                fontFamily:"'Jost',sans-serif", fontWeight:500, border:"none", cursor:"pointer",
                background: baFilter===cat ? "#D4621A" : "var(--card)",
                color: baFilter===cat ? "#ffffff" : "#666",
                transition:"all 0.2s",
                borderRight: cat !== "Lip Filler" ? "0.5px solid rgba(0,0,0,0.08)" : "none",
              }}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="ba-grid">
          {filtered.map(item=>(
            <div key={item.id} className="ba-card" style={{ aspectRatio:"3/4", borderRadius:0 }}>
              <Image src={item.img} alt={item.label} fill style={{ objectFit:"cover" }} sizes="33vw" />
              <div className="ba-overlay" />
              <div style={{ position:"absolute", top:"16px", left:"16px", background:"#D4621A", color:"#ffffff", fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", padding:"6px 14px", fontFamily:"'Jost',sans-serif", fontWeight:500, zIndex:2 }}>
                {item.category}
              </div>
              {/* Label on hover */}
              <div style={{ position:"absolute", bottom:"20px", left:"20px", right:"20px", zIndex:2 }}>
                <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", color:"white", fontWeight:300 }}>{item.label}</div>
                <div style={{ fontSize:"9px", letterSpacing:"2px", textTransform:"uppercase", color:"rgba(255,255,255,0.5)", marginTop:"4px" }}>Dr. Yara Salem</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign:"center", marginTop:"48px" }}>
          <Link href="/treatments" style={{ fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", background:"#D4621A", color:"#ffffff", padding:"16px 40px", textDecoration:"none", fontFamily:"'Jost',sans-serif", fontWeight:500, borderRadius:0 }}>
            {lang==="en"?"View All Treatments":"عرض جميع العلاجات"}
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          7. CLINIC GALLERY AUTO-SCROLL (dark bg)
      ══════════════════════════════════════ */}
      <section data-reveal style={{ padding:"100px 0", background:"#0F0F0F", overflow:"hidden" }}>
        <div style={{ textAlign:"center", marginBottom:"56px", padding:"0 48px" }}>
          <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#D4621A", marginBottom:"16px" }}>
            {lang==="en"?"Inside The Clinic":"داخل العيادة"}
          </div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,42px)", fontWeight:300, color:"white" }}>
            {lang==="en"?<>A Space Built for <em style={{fontStyle:"italic",color:"#D4621A"}}>Luxury</em></>:<>مكان صُمِّم <em style={{fontStyle:"italic",color:"#D4621A"}}>للفخامة</em></>}
          </h2>
        </div>
        {/* Row 1 — left */}
        <div style={{ overflow:"hidden", marginBottom:"14px" }}>
          <div className="scroll-left" style={{ display:"flex", gap:"14px", width:"max-content" }}>
            {[...Array(3)].flatMap((_,r)=>[
              "/images/clinic-reception.png","/images/clinic-roses.png","/images/dr-yara.png","/images/dr-yara-2.png",
            ].map((src,i)=>(
              <div key={`r1-${r}-${i}`} style={{ width:"320px", height:"220px", position:"relative", flexShrink:0, overflow:"hidden" }}>
                <Image src={src} alt="Clinic" fill style={{ objectFit:"cover" }} sizes="320px" />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(15,15,15,0.35) 0%,transparent 60%)" }} />
              </div>
            )))}
          </div>
        </div>
        {/* Row 2 — right */}
        <div style={{ overflow:"hidden" }}>
          <div className="scroll-right" style={{ display:"flex", gap:"14px", width:"max-content" }}>
            {[...Array(3)].flatMap((_,r)=>[
              "/images/ba-veneers-1.png","/images/ba-lips-1.png","/images/clinic-reception.png","/images/ba-teeth-1.png",
            ].map((src,i)=>(
              <div key={`r2-${r}-${i}`} style={{ width:"240px", height:"170px", position:"relative", flexShrink:0, overflow:"hidden" }}>
                <Image src={src} alt="Clinic" fill style={{ objectFit:"cover" }} sizes="240px" />
                <div style={{ position:"absolute", inset:0, background:"linear-gradient(to top,rgba(15,15,15,0.4) 0%,transparent 60%)" }} />
              </div>
            )))}
          </div>
        </div>
        <div style={{ textAlign:"center", marginTop:"40px" }}>
          <div style={{ display:"inline-flex", alignItems:"center", gap:"14px", fontSize:"9px", letterSpacing:"3px", textTransform:"uppercase", color:"#444" }}>
            <span style={{ display:"block", width:"40px", height:"0.5px", background:"#333" }}/>Deir Hanna Clinic
            <span style={{ display:"block", width:"40px", height:"0.5px", background:"#333" }}/>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          8. WHY CHOOSE US (like Jackson's "it's all in the details")
      ══════════════════════════════════════ */}
      <section data-reveal style={{ padding:"100px 48px", background:"var(--surface)" }}>
        <div style={{ textAlign:"center", marginBottom:"60px" }}>
          <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#D4621A", marginBottom:"16px" }}>
            {lang==="en"?"Why Choose Us":"لماذا تختارنا"}
          </div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:300, lineHeight:1.2 }}>
            {lang==="en"?<>It's All in the <em style={{fontStyle:"italic",color:"#D4621A"}}>Details</em></>:<>التفاصيل هي <em style={{fontStyle:"italic",color:"#D4621A"}}>الفارق</em></>}
          </h2>
        </div>
        <div className="why-grid">
          {whyItems.map((w,i)=>(
            <div key={i} className="why-card">
              <div style={{ fontSize:"28px", color:"#D4621A", marginBottom:"20px" }}>{w.icon}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"22px", fontWeight:400, color:"#0F0F0F", marginBottom:"12px" }}>{w.title}</div>
              <p style={{ fontSize:"13px", color:"#777", lineHeight:1.8 }}>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════
          9. COMFORT — image split (no extra full-bleed video)
      ══════════════════════════════════════ */}
      <section data-reveal className="comfort-split" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", minHeight:"480px" }}>
        <div className="comfort-visual" style={{ position:"relative", minHeight:"360px", overflow:"hidden", background:"#0F0F0F" }}>
          <Image src="/images/clinic-reception.png" alt="" fill style={{ objectFit:"cover", opacity:0.9 }} sizes="50vw" />
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(to right, transparent 40%, rgba(15,15,15,0.75) 100%)" }} />
        </div>
        <div style={{ background:"#0F0F0F", padding:"72px 64px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
          <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#D4621A", marginBottom:"20px" }}>
            {lang==="en"?"Experience Excellence":"تجربة التميز"}
          </div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,3vw,44px)", fontWeight:300, color:"white", lineHeight:1.2, marginBottom:"24px" }}>
            {lang==="en"?<>Designed for Your <em style={{fontStyle:"italic",color:"#D4621A"}}>Comfort</em></>:<>مصممة <em style={{fontStyle:"italic",color:"#D4621A"}}>لراحتك</em></>}
          </h2>
          <p style={{ fontSize:"14px", color:"#888", lineHeight:1.9, marginBottom:"36px" }}>
            {lang==="en"
              ?"From the moment you walk in, every element of Dr. Yara's clinic is crafted to make you feel relaxed, valued, and cared for. Luxury is not optional — it's the standard."
              :"من لحظة دخولك، كل عنصر في عيادة د. يارا مصمم لجعلك تشعر بالراحة والتقدير والرعاية. الفخامة ليست خيارًا — إنها المعيار."}
          </p>
          <Link href="/booking" style={{ fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", background:"#D4621A", color:"#ffffff", padding:"16px 36px", textDecoration:"none", fontFamily:"'Jost',sans-serif", fontWeight:500, borderRadius:0, alignSelf:"flex-start" }}>
            {lang==="en"?"Book Your Visit":"احجز زيارتك"}
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          10. TESTIMONIALS (like Jackson's reviews)
      ══════════════════════════════════════ */}
      <section data-reveal style={{ padding:"100px 48px", background:"var(--surface-soft)" }}>
        <div style={{ textAlign:"center", marginBottom:"56px" }}>
          <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#D4621A", marginBottom:"16px" }}>
            {lang==="en"?"Patient Stories":"قصص المرضى"}
          </div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(28px,4vw,44px)", fontWeight:300, lineHeight:1.2 }}>
            {lang==="en"?<>Kind Words from Our <em style={{fontStyle:"italic",color:"#D4621A"}}>Patients</em></>:<>كلمات <em style={{fontStyle:"italic",color:"#D4621A"}}>مرضانا</em></>}
          </h2>
        </div>
        <div className="testimonial-grid">
          {testimonials.map((tm,i)=>(
            <div key={i} className="testi-card">
              <div style={{ display:"flex", gap:"3px", marginBottom:"20px" }}>
                {[...Array(tm.stars)].map((_,s)=>(<span key={s} style={{ color:"#D4621A", fontSize:"14px" }}>★</span>))}
              </div>
              <p style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"20px", fontStyle:"italic", fontWeight:300, color:"#2a2218", lineHeight:1.7, marginBottom:"20px" }}>&ldquo;{tm.text}&rdquo;</p>
              <div style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", color:"#D4621A" }}>— {tm.name}</div>
            </div>
          ))}
        </div>
        {/* CTA below reviews */}
        <div style={{ textAlign:"center", marginTop:"56px", padding:"48px", background:"var(--surface)", border:"0.5px solid rgba(0,0,0,0.06)" }}>
          <div style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(22px,3vw,36px)", fontWeight:300, color:"#0F0F0F", marginBottom:"24px" }}>
            {lang==="en"?<>Ready to Start Your <em style={{fontStyle:"italic",color:"#D4621A"}}>Journey?</em></>:<>مستعد لبدء <em style={{fontStyle:"italic",color:"#D4621A"}}>رحلتك؟</em></>}
          </div>
          <Link href="/booking" style={{ fontSize:"10px", letterSpacing:"2.5px", textTransform:"uppercase", background:"#D4621A", color:"#ffffff", padding:"16px 44px", textDecoration:"none", fontFamily:"'Jost',sans-serif", fontWeight:500, borderRadius:0 }}>
            {lang==="en"?"Schedule Your First Visit":"احجز زيارتك الأولى"}
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════
          11. FINAL CTA DARK BANNER
      ══════════════════════════════════════ */}
      <section data-reveal style={{ padding:"100px 48px", textAlign:"center", background:"#0F0F0F", position:"relative", overflow:"hidden" }}>
        <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 80% at 50% 50%,rgba(212,98,26,0.1) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"relative", zIndex:1 }}>
          <div style={{ fontSize:"10px", letterSpacing:"4px", textTransform:"uppercase", color:"#D4621A", marginBottom:"20px" }}>{t.cta.eyebrow}</div>
          <h2 style={{ fontFamily:"'Cormorant Garamond',serif", fontSize:"clamp(30px,5vw,56px)", fontWeight:300, color:"#F5F0E8", marginBottom:"16px", lineHeight:1.1 }}>
            {t.cta.title} <em style={{ fontStyle:"italic", color:"#D4621A" }}>{t.cta.titleItalic}</em>
          </h2>
          <p style={{ fontSize:"13px", color:"#555", marginBottom:"40px" }}>{t.cta.subtitle}</p>
          <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
            <Link href="/booking" style={{ fontSize:"11px", letterSpacing:"3px", textTransform:"uppercase", background:"#D4621A", color:"#ffffff", padding:"18px 48px", textDecoration:"none", fontFamily:"'Jost',sans-serif", fontWeight:500, borderRadius:0 }}>
              {t.cta.btn}
            </Link>
            <a href="https://wa.me/972547997273" target="_blank" rel="noreferrer" style={{ fontSize:"11px", letterSpacing:"2px", textTransform:"uppercase", background:"transparent", color:"#F5F0E8", padding:"17px 36px", border:"1px solid rgba(255,255,255,0.2)", textDecoration:"none", fontFamily:"'Jost',sans-serif", display:"flex", alignItems:"center", gap:"10px" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="#25D366"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>

      <Footer lang={lang} />
    </div>
  );
}


